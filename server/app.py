from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from datetime import datetime, timedelta
import os
import re
import jwt
from flask_cors import cross_origin
from functools import wraps
from database import db, init_db
from sqlalchemy import func
from models import User, Unit, Enrollment, Rating, ProfileSettings, Assignment, Submission


# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        "allow_headers": ["Authorization", "Content-Type"],
        "expose_headers": ["Content-Type"],
        "supports_credentials": True,
        "max_age": 600
    }
})

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(os.path.abspath(os.path.dirname(__file__)), 'lms.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('JWT_SECRET', 'super-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access']

# Initialize extensions
init_db(app)
api = Api(app)
migrate = Migrate(app, db)

# Import models after db initialization to avoid circular imports

# Create database tables
with app.app_context():
    db.create_all()

# JWT Configuration
BLACKLIST = set()
SECRET_KEY = app.config['SECRET_KEY']

def requires_teacher_role(f):
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if current_user.role != 'teacher':
            return jsonify({'message': 'Teacher access required'}), 403
        return f(current_user, *args, **kwargs)
    return decorated


def generate_token(user_id):
    """Generate a new JWT token for a user"""
    try:
        payload = {
            'exp': datetime.utcnow() + timedelta(hours=24),
            'iat': datetime.utcnow(),
            'sub': str(user_id)
        }
        return jwt.encode(
            payload,
            SECRET_KEY,
            algorithm='HS256'
        )
    except Exception as e:
        return str(e)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')

        if auth_header:
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'message': 'Token is missing'}), 401

        if not token:
            return jsonify({'message': 'Token is required'}), 401

        if token in BLACKLIST:
            return jsonify({'message': 'Token has been revoked'}), 401

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            # Convert 'sub' back to int when retrieving the user
            current_user = User.query.get(int(payload['sub']))
            if not current_user:
                return jsonify({'message': 'User not found'}), 404
            return f(current_user, *args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
    return decorated




@app.route('/')
def welcome():
    return "Welcome to the LMS API!"


@token_required
@requires_teacher_role
def get_teacher_dashboard(current_user, teacher_id):
    if current_user.id != teacher_id:
        return jsonify({'message': 'Unauthorized access'}), 403
    
    total_units = Unit.query.filter_by(teacher_id=teacher_id).count()
    total_students = Enrollment.query\
        .join(Unit, Enrollment.unit_id == Unit.id)\
        .filter(Unit.teacher_id == teacher_id)\
        .distinct(Enrollment.student_id)\
        .count()

    recent_activities = db.session.query(
        func.date(Enrollment.enrollment_date).label('date'),
        func.count().label('count')
    ).join(Unit).filter(Unit.teacher_id == teacher_id)\
     .group_by(func.date(Enrollment.enrollment_date))\
     .order_by(func.date(Enrollment.enrollment_date).desc())\
     .limit(5).all()

    return jsonify({
        'totalUnits': total_units,
        'totalStudents': total_students,
        'recentActivities': [
            {'date': date, 'description': f'{count} new enrollments'}
            for date, count in recent_activities
        ]
    })


# Authentication routes
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing credentials'}), 400

    user = User.query.filter_by(email=data['email']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401

    token = generate_token(user.id)
    response = jsonify({
        'message': 'Login successful',
        'access_token': token,
        'user_id': user.id,
        'role': user.role
    })
    response.set_cookie('token', token, httponly=True, secure=True)
    return response, 200

@app.route('/api/teacher/login', methods=['POST', 'OPTIONS'])
def teacher_login():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing credentials'}), 400

    user = User.query.filter_by(email=data['email'], role='teacher').first()
    if not user:
        return jsonify({'error': 'Teacher account not found'}), 404

    if not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401

    token = generate_token(user.id)
    response = jsonify({
        'message': 'Login successful',
        'access_token': token,
        'user_id': user.id,
        'role': user.role
    })
    response.set_cookie('token', token, httponly=True, secure=True)
    return response, 200

@app.route('/api/assignments', methods=['POST'])
@token_required
@requires_teacher_role
def create_assignment(current_user):
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['title', 'description', 'due_date', 'max_score', 'unit_id']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

@app.route('/api/student/<int:student_id>/units', methods=['GET', 'OPTIONS'])
def get_student_units(student_id):
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Methods', 'GET')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        return response, 204

    # Apply token_required decorator logic manually for non-OPTIONS requests
    token = None
    auth_header = request.headers.get('Authorization')

    if not auth_header:
        return jsonify({'message': 'Token is required'}), 401

    try:
        token = auth_header.split(" ")[1]
    except IndexError:
        return jsonify({'message': 'Token is missing'}), 401

    if token in BLACKLIST:
        return jsonify({'message': 'Token has been revoked'}), 401

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        current_user = User.query.get(int(payload['sub']))
        if not current_user:
            return jsonify({'message': 'User not found'}), 404
        
        # Get enrolled units for the student
        enrolled_units = Unit.query.join(Enrollment).filter(Enrollment.student_id == student_id).all()
        units_data = [unit.to_dict() for unit in enrolled_units]
        return jsonify(units_data)
        if not current_user:
            return jsonify({'message': 'User not found'}), 404
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401

    if current_user.id != student_id or current_user.role != 'student':
        return jsonify({'error': 'Unauthorized access'}), 403

    if current_user.id != student_id or current_user.role != 'student':
        return jsonify({'error': 'Unauthorized access'}), 403

    try:
        enrollments = Enrollment.query.filter_by(student_id=student_id).all()
        units_data = [
            {
                'id': enrollment.unit.id,
                'title': enrollment.unit.title,
                'description': enrollment.unit.description,
                'category': enrollment.unit.category,
                'teacher': enrollment.unit.teacher.username,
                'progress': enrollment.progress or 0
            }
            for enrollment in enrollments
        ]
        return jsonify(units_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/student/units/<int:unit_id>/assignments', methods=['GET', 'OPTIONS'])
def get_student_assignments(unit_id):
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers.add('Access-Control-Allow-Methods', 'GET')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        return response, 204

    # Apply token_required decorator logic manually for non-OPTIONS requests
    token = None
    auth_header = request.headers.get('Authorization')

    if not auth_header:
        return jsonify({'message': 'Token is required'}), 401

    try:
        token = auth_header.split(" ")[1]
    except IndexError:
        return jsonify({'message': 'Token is missing'}), 401

    if token in BLACKLIST:
        return jsonify({'message': 'Token has been revoked'}), 401

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        current_user = User.query.get(int(payload['sub']))
        if not current_user:
            return jsonify({'message': 'User not found'}), 404
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401

    if current_user.role != 'student':
        return jsonify({'error': 'Unauthorized access'}), 403

    try:
        # Check if the student is enrolled in the unit
        enrollment = Enrollment.query.filter_by(student_id=current_user.id, unit_id=unit_id).first()
        if not enrollment:
            return jsonify({'error': 'You are not enrolled in this unit'}), 403

        assignments = Assignment.query.filter_by(unit_id=unit_id).all()
        assignments_data = [
            {
                'id': assignment.id,
                'title': assignment.title,
                'description': assignment.description,
                'due_date': assignment.due_date.isoformat() if assignment.due_date else None,
                'max_score': assignment.max_score,
                'completed': enrollment.progress >= 100
            }
            for assignment in assignments
        ]
        return jsonify(assignments_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    # Verify the unit belongs to the teacher
    unit = Unit.query.get(data['unit_id'])
    if not unit or unit.teacher_id != current_user.id:
        return jsonify({'error': 'Unit not found or unauthorized'}), 403
    
    # Create new assignment
    try:
        # Validate and parse the due date
        try:
            due_date_str = data['due_date']
            # Handle the case where the date might come with 'T' separator
            due_date_str = due_date_str.replace('T', ' ')
            # Remove timezone info if present
            if '+' in due_date_str:
                due_date_str = due_date_str.split('+')[0]
            if 'Z' in due_date_str:
                due_date_str = due_date_str.replace('Z', '')
            # Parse the date
            due_date = datetime.strptime(due_date_str, '%Y-%m-%d %H:%M')
        except ValueError as e:
            return jsonify({'error': f'Invalid date format: {str(e)}'}), 400

        # Validate max_score
        try:
            max_score = float(data['max_score'])
            if max_score < 0:
                return jsonify({'error': 'Max score cannot be negative'}), 400
        except ValueError:
            return jsonify({'error': 'Invalid max score format'}), 400

        new_assignment = Assignment(
            title=data['title'],
            description=data['description'],
            due_date=due_date,
            max_score=max_score,
            unit_id=data['unit_id']
        )
        db.session.add(new_assignment)
        db.session.commit()
        return jsonify({'message': 'Assignment created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        app.logger.error(f'Error creating assignment: {str(e)}')
        return jsonify({'error': f'Failed to create assignment: {str(e)}'}), 500

@app.route('/api/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return '', 204

    data = request.get_json()
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing required fields'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 409
    
    new_user = User(
        username=data['username'],
        email=data['email'],
        role='student'
    )
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()
    
    token = generate_token(new_user.id)
    response = jsonify({
        'message': 'User created successfully',
        'access_token': token,
        'user_id': new_user.id,
        'role': new_user.role
    })
    response.set_cookie('token', token, httponly=True, secure=True)
    return response, 201

@app.route('/api/teachers/<int:teacher_id>', methods=['GET', 'OPTIONS'])
@token_required
def get_teacher(current_user, teacher_id):
    if request.method == 'OPTIONS':
        return '', 204

    if current_user.id != teacher_id or current_user.role != 'teacher':
        return jsonify({'error': 'Unauthorized access'}), 403

    teacher = User.query.filter_by(id=teacher_id, role='teacher').first()
    if not teacher:
        return jsonify({'error': 'Teacher not found'}), 404

    return jsonify({'email': teacher.email})



@app.route('/api/teacher/register', methods=['POST', 'OPTIONS'])
def teacher_register():
    if request.method == 'OPTIONS':
        return '', 204

    data = request.get_json()
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing required fields'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 409
    
    new_teacher = User(
        username=data['username'],
        email=data['email'],
        role='teacher',
        qualifications=data.get('qualifications'),
        bio=data.get('bio')
    )
    new_teacher.set_password(data['password'])
    db.session.add(new_teacher)
    db.session.commit()
    
    token = generate_token(new_teacher.id)
    response = jsonify({
        'message': 'Teacher registered successfully',
        'access_token': token,
        'user_id': new_teacher.id,
        'role': new_teacher.role
    })
    response.set_cookie('token', token, httponly=True, secure=True)
    return response, 201

# Protected routes
@app.route('/api/units', methods=['GET'])
def get_units():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 12, type=int)
    sort_by = request.args.get('sort_by', 'title')

    try:
        units_query = Unit.query
        
        if sort_by == 'rating':
            units_query = units_query.order_by(Unit.average_rating.desc())
        elif sort_by == 'date':
            units_query = units_query.order_by(Unit.start_date.desc())
        else:
            units_query = units_query.order_by(Unit.title)

        pagination = units_query.paginate(page=page, per_page=per_page, error_out=False)
        units = pagination.items

        units_data = [{
            'id': unit.id,
            'title': unit.title,
            'description': unit.description,
            'category': unit.category,
            'start_date': unit.start_date.isoformat() if unit.start_date else None,
            'end_date': unit.end_date.isoformat() if unit.end_date else None,
            'teacher': {
                'id': unit.teacher_id,
                'name': unit.teacher.username
            },
            'average_rating': unit.average_rating,
            'rating_count': unit.rating_count,
            'total_enrolled': len(unit.enrollments)
        } for unit in units]

        return jsonify({
            'units': units_data,
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/units/latest')
def get_latest_units():
    units = Unit.query.order_by(Unit.created_at.desc()).limit(6).all()
    return jsonify([{
        'id': unit.id,
        'title': unit.title,
        'description': unit.description,
        'category': unit.category,
        'start_date': unit.start_date.isoformat() if unit.start_date else None,
        'end_date': unit.end_date.isoformat() if unit.end_date else None,
        'teacher': {
            'id': unit.teacher_id,
            'name': unit.teacher.username
        },
        'average_rating': unit.average_rating,
        'rating_count': unit.rating_count,
        'total_enrolled': len(unit.enrollments)
    } for unit in units])


@app.route('/api/teacher/')
def get_featured_teachers():
    featured_teachers = User.query\
        .filter_by(role='teacher')\
        .join(Unit)\
        .group_by(User.id)\
        .order_by(func.count(Unit.id).desc())\
        .limit(3)\
        .all()
    return jsonify([teacher.to_dict() for teacher in featured_teachers])
    teachers = User.query.filter_by(role='teacher')\
        .join(Unit, User.id == Unit.teacher_id)\
        .group_by(User.id)\
        .order_by(func.count(Unit.id).desc())\
        .limit(3)\
        .all()
    
    return jsonify([{
        'id': teacher.id,
        'name': teacher.username,
        'bio': teacher.bio,
        'qualifications': teacher.qualifications,
        'total_units': len(teacher.created_units),
        'total_students': sum(len(unit.enrollments) for unit in teacher.created_units)
    } for teacher in teachers])

@app.route('/api/units/popular')
def get_popular_units():
    units = Unit.query\
        .join(Enrollment)\
        .group_by(Unit.id)\
        .order_by(func.count(Enrollment.id).desc(), Unit.average_rating.desc())\
        .limit(6)\
        .all()

    units_data = [{
        'id': unit.id,
        'title': unit.title,
        'description': unit.description,
        'category': unit.category,
        'start_date': unit.start_date.isoformat() if unit.start_date else None,
        'end_date': unit.end_date.isoformat() if unit.end_date else None,
        'teacher': {
            'id': unit.teacher_id,
            'name': unit.teacher.username
        },
        'average_rating': unit.average_rating,
        'rating_count': unit.rating_count,
        'total_enrolled': len(unit.enrollments)
    } for unit in units]

    return jsonify(units_data)

@app.route('/api/units/recommended')
def get_recommended_units():
    units = Unit.query\
        .order_by(Unit.average_rating.desc())\
        .limit(3)\
        .all()
    
    return jsonify([{
        'id': unit.id,
        'title': unit.title,
        'description': unit.description,
        'category': unit.category,
        'start_date': unit.start_date.isoformat() if unit.start_date else None,
        'end_date': unit.end_date.isoformat() if unit.end_date else None,
        'teacher': {
            'id': unit.teacher_id,
            'name': unit.teacher.username
        },
        'average_rating': unit.average_rating,
        'rating_count': unit.rating_count,
        'total_enrolled': len(unit.enrollments)
    } for unit in units])

@app.route('/api/enrollments', methods=['POST'])
@token_required
def create_enrollment(current_user):
    data = request.get_json()
    
    # Check if unit exists
    unit = Unit.query.get(data['unit_id'])
    if not unit:
        return jsonify({'error': 'Unit not found'}), 404

    # Check for existing enrollment
    existing_enrollment = Enrollment.query.filter_by(
        student_id=current_user.id,
        unit_id=data['unit_id']
    ).first()
    
    if existing_enrollment:
        return jsonify({'error': 'Already enrolled in this unit'}), 409

    enrollment = Enrollment(
        student_id=current_user.id,
        unit_id=data['unit_id'],
        enrollment_date=datetime.utcnow()
    )
    db.session.add(enrollment)
    db.session.commit()
    
    return jsonify({'message': 'Enrollment successful'}), 201


@app.route('/api/ratings', methods=['POST'])
@token_required
def create_rating(current_user):
    data = request.get_json()
    
    rating = Rating(
        unit_id=data['unit_id'],
        student_id=current_user.id,
        score=data['score'],
        comment=data.get('comment')  # Ensure your Rating model has a 'comment' field if needed.
    )
    db.session.add(rating)
    db.session.commit()
    
    return jsonify({'message': 'Rating submitted successfully'}), 201


# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/units/category/<category>')
def get_units_by_category(category):
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 12, type=int)

    try:
        units_query = Unit.query.filter_by(category=category)
        
        # Apply sorting if specified
        sort_by = request.args.get('sort_by', 'title')
        if sort_by == 'rating':
            units_query = units_query.order_by(Unit.average_rating.desc())
        elif sort_by == 'date':
            units_query = units_query.order_by(Unit.start_date.desc())
        else:
            units_query = units_query.order_by(Unit.title)

        # Get paginated results
        pagination = units_query.paginate(page=page, per_page=per_page, error_out=False)
        
        units = pagination.items
        units_data = [{
            'id': unit.id,
            'title': unit.title,
            'description': unit.description,
            'category': unit.category,
            'start_date': unit.start_date.isoformat() if unit.start_date else None,
            'end_date': unit.end_date.isoformat() if unit.end_date else None,
            'teacher': {
                'id': unit.teacher_id,
                'name': User.query.get(unit.teacher_id).username
            },
            'average_rating': unit.average_rating,
            'rating_count': unit.rating_count,
            'total_enrolled': len(unit.enrollments)
        } for unit in units]

        return jsonify({
            'units': units_data,
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/units/categories')
def get_categories():
    try:
        categories = db.session.query(Unit.category).distinct().all()
        return jsonify({'categories': [cat[0] for cat in categories if cat[0]]})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/units/<int:unit_id>')
def get_unit_detail(unit_id):
    try:
        unit = Unit.query.get_or_404(unit_id)
        teacher = User.query.get(unit.teacher_id)

        # Check if the current user is enrolled
        is_enrolled = False
        auth_header = request.headers.get('Authorization')
        if auth_header:
            try:
                token = auth_header.split(" ")[1]
                payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
                current_user_id = int(payload['sub'])
                is_enrolled = Enrollment.query.filter_by(
                    student_id=current_user_id,
                    unit_id=unit_id
                ).first() is not None
            except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, IndexError):
                pass

        unit_data = {
            'id': unit.id,
            'title': unit.title,
            'description': unit.description,
            'category': unit.category,
            'start_date': unit.start_date.isoformat() if unit.start_date else None,
            'end_date': unit.end_date.isoformat() if unit.end_date else None,
            'teacher': {
                'id': teacher.id,
                'name': teacher.username,
                'bio': teacher.bio if hasattr(teacher, 'bio') else None
            },
            'average_rating': unit.average_rating,
            'rating_count': unit.rating_count,
            'total_enrolled': len(unit.enrollments),
            'video_url': unit.video_url,
            'is_enrolled': is_enrolled,
            'assignments': [{
                'id': assignment.id,
                'title': assignment.title
            } for assignment in unit.assignments]
        }

        # Get related units (same category, excluding current unit)
        related_units = Unit.query.filter(
            Unit.category == unit.category,
            Unit.id != unit.id
        ).limit(4).all()

        unit_data['related_units'] = [{
            'id': related.id,
            'title': related.title,
            'description': related.description,
            'teacher': {
                'id': related.teacher_id,
                'name': related.teacher.username
            },
            'average_rating': related.average_rating,
            'total_enrolled': len(related.enrollments)
        } for related in related_units]

        return jsonify(unit_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/units/progress')
@token_required
def get_units_with_progress(current_user):
    try:
        # Query enrollments with progress > 30%
        enrollments = Enrollment.query.filter(
            Enrollment.student_id == current_user.id,
            Enrollment.progress > 30
        ).all()

        # Get the corresponding units
        units_data = []
        for enrollment in enrollments:
            unit = Unit.query.get(enrollment.unit_id)
            if unit:
                unit_data = {
                    'id': unit.id,
                    'title': unit.title,
                    'teacher': unit.teacher.username,
                    'progress': enrollment.progress
                }
                units_data.append(unit_data)

        return jsonify(units_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/profile/<int:user_id>', methods=['GET', 'POST', 'PUT'])
@token_required
def manage_profile(current_user, user_id):
    if current_user.id != user_id:
        return jsonify({'error': 'Unauthorized access'}), 403

    if request.method == 'GET':
        profile = ProfileSettings.query.filter_by(user_id=user_id).first()
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404

        user = User.query.get(user_id)
        return jsonify({
            'fullName': user.username,
            'email': user.email,
            'interests': user.bio,
            'theme': profile.theme,
            'notifications_enabled': profile.notifications_enabled,
            'language': profile.language
        })

    data = request.get_json()
    
    if request.method == 'POST':
        if ProfileSettings.query.filter_by(user_id=user_id).first():
            return jsonify({'error': 'Profile already exists'}), 409

        profile = ProfileSettings(
            user_id=user_id,
            theme=data.get('theme', 'light'),
            notifications_enabled=data.get('notifications_enabled', True),
            language=data.get('language', 'en')
        )
        
        user = User.query.get(user_id)
        if user:
            user.username = data.get('fullName', user.username)
            user.bio = data.get('interests', '')

        db.session.add(profile)
        db.session.commit()

        return jsonify({
            'message': 'Profile created successfully',
            'profile': {
                'fullName': user.username,
                'email': user.email,
                'interests': user.bio,
                'theme': profile.theme,
                'notifications_enabled': profile.notifications_enabled,
                'language': profile.language
            }
        }), 201

    elif request.method == 'PUT':
        profile = ProfileSettings.query.filter_by(user_id=user_id).first()
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404

        profile.theme = data.get('theme', profile.theme)
        profile.notifications_enabled = data.get('notifications_enabled', profile.notifications_enabled)
        profile.language = data.get('language', profile.language)

        user = User.query.get(user_id)
        if user:
            user.username = data.get('fullName', user.username)
            user.bio = data.get('interests', user.bio)

        db.session.commit()

        return jsonify({
            'message': 'Profile updated successfully',
            'profile': {
                'fullName': user.username,
                'email': user.email,
                'interests': user.bio,
                'theme': profile.theme,
                'notifications_enabled': profile.notifications_enabled,
                'language': profile.language
            }
        })

@app.route('/api/testimonials')
def get_testimonials():
    testimonials = [
        {
            'id': 1,
            'name': 'John Doe',
            'role': 'Student',
            'content': 'The courses here have transformed my learning experience!',
            'rating': 5
        },
        {
            'id': 2,
            'name': 'Jane Smith',
            'role': 'Professional',
            'content': 'Excellent platform for skill development.',
            'rating': 4.5
        }
    ]
    return jsonify(testimonials)

@app.route('/api/student/dashboard/<int:student_id>', methods=['GET', 'OPTIONS'])
@token_required
def get_student_dashboard(current_user, student_id):
    # Allow preflight OPTIONS request
    if request.method == 'OPTIONS':
        return '', 204

    # Ensure that the logged-in user is accessing their own dashboard.
    if current_user.id != student_id or current_user.role != 'student':
        return jsonify({'error': 'Unauthorized access'}), 403

    try:
        # Count total enrollments (courses student is enrolled in)
        enrolled_courses = Enrollment.query.filter_by(student_id=student_id).count()

        # Count completed courses (where progress is 100)
        completed_courses = Enrollment.query.filter_by(student_id=student_id, progress=100).count()

        # Calculate average score using the grade field from enrollments that have been graded
        enrollments = Enrollment.query.filter_by(student_id=student_id).all()
        total_score = 0
        graded_count = 0
        for enrollment in enrollments:
            if enrollment.grade is not None:
                total_score += enrollment.grade
                graded_count += 1
        average_score = round((total_score / graded_count) * 100) if graded_count > 0 else 0

        # Fetch recent activities (for example, the last 5 enrollments)
        recent_enrollments = Enrollment.query.filter_by(student_id=student_id)\
            .order_by(Enrollment.enrollment_date.desc())\
            .limit(5).all()
        recent_activities = [{
            'description': f"Enrolled in {enrollment.unit.title}",
            'date': enrollment.enrollment_date.strftime('%Y-%m-%d %H:%M')
        } for enrollment in recent_enrollments]

        return jsonify({
            'enrolledCourses': enrolled_courses,
            'completedCourses': completed_courses,
            'averageScore': average_score,
            'recentActivities': recent_activities
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/teacher/<int:teacher_id>', methods=['GET', 'OPTIONS'])
def get_teacher_details(teacher_id):
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,OPTIONS')
        return response, 204

    try:
        # Retrieve teacher data (ensure the user is a teacher)
        teacher = User.query.filter_by(id=teacher_id, role='teacher').first()
        if not teacher:
            return jsonify({'error': 'Teacher not found'}), 404

        # Retrieve teacher's units ordered by creation date (most recent first)
        units = Unit.query.filter_by(teacher_id=teacher_id).order_by(Unit.created_at.desc()).all()
        units_data = [unit.to_dict() for unit in units]

        # Calculate overall rating across all units
        total_rating = 0
        total_count = 0
        for unit in units:
            unit_ratings = Rating.query.filter_by(unit_id=unit.id).all()
            if unit_ratings:
                total_rating += sum(r.score for r in unit_ratings)
                total_count += len(unit_ratings)
        avg_rating = total_rating / total_count if total_count > 0 else 0

        teacher_data = {
            'id': teacher.id,
            'username': teacher.username,
            'email': teacher.email,
            'bio': teacher.bio,
            'qualifications': teacher.qualifications,
            'units': units_data,
            'ratings': {
                'average': avg_rating,
                'count': total_count
            }
        }
        return jsonify(teacher_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/api/users/<int:user_id>', methods=['GET'])
@token_required
def get_user_details(current_user, user_id):
    if current_user.id != user_id:
        return jsonify({'error': 'Unauthorized access'}), 403

    try:
        user = User.query.get_or_404(user_id)
        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/teacher/enrolled-students/<int:teacher_id>', methods=['GET'])
@token_required
@requires_teacher_role
def get_enrolled_students(current_user, teacher_id):
    if current_user.id != teacher_id:
        return jsonify({'error': 'Unauthorized access'}), 403

    try:
        # Query enrollments for all units taught by this teacher
        enrollments = db.session.query(
            Enrollment, Unit, User
        ).join(
            Unit, Enrollment.unit_id == Unit.id
        ).join(
            User, Enrollment.student_id == User.id
        ).filter(
            Unit.teacher_id == teacher_id
        ).all()

        # Format the response
        students_data = [{
            'student_name': student.username,
            'unit_title': unit.title,
            'username': student.email,
            'enrollment_id': enrollment.id
        } for enrollment, unit, student in enrollments]

        return jsonify({'enrolled_students': students_data})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/student/units/<int:student_id>/<int:unit_id>/progress', methods=['PUT'])
@token_required
def update_unit_progress(current_user, student_id, unit_id):
    """Update student's progress in a unit."""
    if current_user.id != student_id:
        return jsonify({'error': 'Unauthorized access'}), 403

    data = request.get_json()
    progress = data.get('progress')
    
    if progress is None or not isinstance(progress, int) or progress < 0 or progress > 100:
        return jsonify({'error': 'Invalid progress value'}), 400

    enrollment = Enrollment.query.filter_by(student_id=student_id, unit_id=unit_id).first()
    if not enrollment:
        return jsonify({'error': 'Enrollment not found'}), 404

    enrollment.progress = progress
    db.session.commit()
    
    return jsonify({'message': 'Progress updated successfully', 'progress': progress}), 200


@app.route('/api/student-enrolled-units/<int:student_id>', methods=['GET'])
@token_required
def get_student_enrolled_units(current_user, student_id):
    if current_user.id != student_id:
        return jsonify({'message': 'Unauthorized access'}), 403

    enrollments = Enrollment.query.filter_by(student_id=student_id).all()
    units = []
    for enrollment in enrollments:
        unit = enrollment.unit.to_dict()
        unit['progress'] = enrollment.progress
        units.append(unit)

    return jsonify({'units': units})

@app.route('/api/student-enrolled-units/<int:student_id>/<int:unit_id>', methods=['DELETE'])
@token_required
def unenroll_student(current_user, student_id, unit_id):
    if current_user.id != student_id:
        return jsonify({'message': 'Unauthorized access'}), 403

    enrollment = Enrollment.query.filter_by(student_id=student_id, unit_id=unit_id).first()
    if not enrollment:
        return jsonify({'message': 'Enrollment not found'}), 404

    db.session.delete(enrollment)
    db.session.commit()
    return jsonify({'message': 'Successfully unenrolled from the unit'})


@app.route('/api/units/create', methods=['POST'])
@token_required
def create_unit(current_user):
    """Create a new unit by a teacher."""
    # Ensure only teachers can create units
    if current_user.role != 'teacher':
        return jsonify({'error': 'Only teachers can create units'}), 403

    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 422

    validation_errors = {}
    if not data.get('title'):
        validation_errors['title'] = 'Title is required'
    if not data.get('description'):
        validation_errors['description'] = 'Description is required'
    if not data.get('category'):
        validation_errors['category'] = 'Category is required'
    if not data.get('video_url'):
        validation_errors['video_url'] = 'Video URL is required'
    else:
        youtube_regex = r'^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+'
        if not re.match(youtube_regex, data['video_url']):
            validation_errors['video_url'] = 'Invalid YouTube URL'
        
    if validation_errors:
        return jsonify({'error': 'Validation failed', 'details': validation_errors}), 422

    # Validate dates if provided
    start_date = None
    end_date = None
    try:
        if data.get('start_date'):
            start_date = datetime.strptime(data['start_date'], '%Y-%m-%d')
        if data.get('end_date'):
            end_date = datetime.strptime(data['end_date'], '%Y-%m-%d')
            if start_date and end_date < start_date:
                return jsonify({'error': 'End date must be after start date'}), 422
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 422

    new_unit = Unit(
        title=data['title'],
        description=data['description'],
        category=data.get('category'),
        video_url=data.get('video_url'),
        teacher_id=current_user.id,
        start_date=start_date,
        end_date=end_date
    )
    
    db.session.add(new_unit)
    db.session.commit()
    
    return jsonify({
        'message': 'Unit created successfully',
        'unit': new_unit.to_dict()
    }), 201



@app.route('/api/teacher/units/<int:unit_id>/students')
@token_required
@requires_teacher_role
def get_unit_students(current_user, unit_id):
    unit = Unit.query.filter_by(id=unit_id, teacher_id=current_user.id).first()
    if not unit:
        return jsonify({'error': 'Unit not found'}), 404
    
    students = db.session.query(
        User.id.label('student_id'),
        User.username.label('full_name'),
        Unit.title.label('unit_title'),
        Enrollment.assignment_score,
        Enrollment.cat_score,
        Enrollment.exam_score
    ).join(Enrollment, User.id == Enrollment.student_id
    ).join(Unit, Enrollment.unit_id == Unit.id
    ).filter(Enrollment.unit_id == unit_id
    ).all()
    
    return jsonify([row._asdict() for row in students])

@app.route('/api/teacher/students/<int:student_id>/grades', methods=['PUT'])
@token_required
@requires_teacher_role
def update_student_grades(current_user, student_id):
    data = request.get_json()
    unit_id = data.get('unit_id')
    
    enrollment = Enrollment.query.filter_by(
        student_id=student_id,
        unit_id=unit_id
    ).first()
    
    if not enrollment or enrollment.unit.teacher_id != current_user.id:
        return jsonify({'error': 'Enrollment not found'}), 404
    
    enrollment.assignment_score = data.get('assignment_score', enrollment.assignment_score)
    enrollment.cat_score = data.get('cat_score', enrollment.cat_score)
    enrollment.exam_score = data.get('exam_score', enrollment.exam_score)
    db.session.commit()
    
    return jsonify({'message': 'Grades updated successfully'})

@app.route('/api/teacher/units', methods=['GET'])
@token_required
@requires_teacher_role
def get_teacher_units(current_user):
    try:
        units = Unit.query.filter_by(teacher_id=current_user.id).all()
        return jsonify([unit.to_dict() for unit in units])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/profile/<int:user_id>', methods=['GET', 'PUT', 'POST', 'OPTIONS'])
@cross_origin()
@token_required
def user_profile(current_user, user_id):
    # Allow preflight OPTIONS request
    if request.method == 'OPTIONS':
        return '', 204

    # Ensure the user is accessing their own profile
    if current_user.id != user_id:
        return jsonify({'error': 'Unauthorized access'}), 403

    # POST: Create profile if it doesn't exist
    if request.method == 'POST':
        if current_user.profile_settings:
            return jsonify({'error': 'Profile already exists'}), 400
        
        data = request.get_json() or {}
        
        try:
            profile_settings = ProfileSettings(
                user_id=current_user.id,
                fullName=data.get('fullName', current_user.username),
                theme=data.get('theme', 'light'),
                notifications_enabled=data.get('notifications_enabled', True),
                language=data.get('language', 'en'),
                interests=data.get('interests', '')
            )
            db.session.add(profile_settings)
            
            # Update user details if provided
            current_user.username = data.get('fullName', current_user.username)
            current_user.bio = data.get('interests', current_user.bio)
            
            db.session.commit()
            
            return jsonify({
                'message': 'Profile created successfully',
                'profile': {
                    'fullName': current_user.username,
                    'email': current_user.email,
                    'interests': current_user.bio,
                    'theme': profile_settings.theme,
                    'notifications_enabled': profile_settings.notifications_enabled,
                    'language': profile_settings.language
                }
            }), 201
        
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

    # GET: Return user profile data
    if request.method == 'GET':
        profile_settings = current_user.profile_settings
        
        if not profile_settings:
            return jsonify({'error': 'Profile not found'}), 404

        return jsonify({
            'fullName': current_user.username,
            'email': current_user.email,
            'interests': current_user.bio or '',
            'theme': profile_settings.theme,
            'notifications_enabled': profile_settings.notifications_enabled,
            'language': profile_settings.language
        })

    # PUT: Update user profile and profile settings
    if request.method == 'PUT':
        try:
            data = request.get_json()
            if not data:
                return jsonify({'error': 'No data provided'}), 400

            # Update basic user details
            current_user.username = data.get('fullName', current_user.username)
            current_user.bio = data.get('interests', current_user.bio)

            # Retrieve or create profile settings
            profile_settings = current_user.profile_settings
            if not profile_settings:
                profile_settings = ProfileSettings(
                    user_id=current_user.id,
                    theme=data.get('theme', 'light'),
                    notifications_enabled=data.get('notifications_enabled', True),
                    language=data.get('language', 'en')
                )
                db.session.add(profile_settings)
            else:
                # Update profile-related fields
                profile_settings.theme = data.get('theme', profile_settings.theme)
                profile_settings.notifications_enabled = data.get('notifications_enabled', profile_settings.notifications_enabled)
                profile_settings.language = data.get('language', profile_settings.language)

            db.session.commit()
            
            return jsonify({
                'message': 'Profile updated successfully',
                'profile': {
                    'fullName': current_user.username,
                    'email': current_user.email,
                    'interests': current_user.bio,
                    'theme': profile_settings.theme,
                    'notifications_enabled': profile_settings.notifications_enabled,
                    'language': profile_settings.language
                }
            })
        
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

@app.route('/api/change-password/<int:user_id>', methods=['PATCH', 'OPTIONS'])
@cross_origin()
@token_required
def update_password_endpoint(current_user, user_id):
    # If it's an OPTIONS request, immediately return a successful CORS response
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'PATCH, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response.status_code = 200
        return response

    # Verify the user making the request matches the user ID in the URL
    if current_user.id != user_id:
        return jsonify({'error': 'Unauthorized access'}), 403

    data = request.get_json()
    current_password = data.get('current_password')
    new_password = data.get('new_password')
    email = data.get('email')
    user_type = data.get('user_type')  # Added to match frontend

    # Validate input
    if not all([current_password, new_password, email]):
        return jsonify({'error': 'Current password, new password, and email are required'}), 400

    # Verify email matches current user
    if email != current_user.email:
        return jsonify({'error': 'Email verification failed. Please ensure you are using the correct account.'}), 401

    # Check current password
    if not current_user.check_password(current_password):
        return jsonify({'error': 'Current password is incorrect'}), 401

    # Validate new password
    if len(new_password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters long'}), 400

    try:
        # Update password
        current_user.set_password(new_password)
        db.session.commit()
        return jsonify({
            'message': 'Password updated successfully', 
            'user_type': user_type
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'An error occurred while updating the password'}), 500

@app.route('/api/teacher/<int:teacher_id>/units', methods=['GET'])
@token_required
def get_specific_teacher_units(current_user, teacher_id):
    if current_user.id != teacher_id or current_user.role != 'teacher':
        return jsonify({'error': 'Unauthorized access'}), 403

    units = Unit.query.filter_by(teacher_id=teacher_id).all()
    return jsonify([unit.to_dict() for unit in units])

@app.route('/api/teacher/units/<int:unit_id>/submissions', methods=['GET'])
@token_required
def get_unit_submissions(current_user, unit_id):
    # Verify the teacher owns this unit
    unit = Unit.query.get_or_404(unit_id)
    if current_user.id != unit.teacher_id or current_user.role != 'teacher':
        return jsonify({'error': 'Unauthorized access'}), 403

    # Get all assignments for this unit
    assignments = Assignment.query.filter_by(unit_id=unit_id).all()
    assignment_ids = [assignment.id for assignment in assignments]

    # Get all submissions for these assignments
    submissions = Submission.query.filter(Submission.assignment_id.in_(assignment_ids)).all()

    # Format submissions with student and assignment details
    formatted_submissions = []
    for submission in submissions:
        student = User.query.get(submission.student_id)
        assignment = Assignment.query.get(submission.assignment_id)
        formatted_submissions.append({
            'id': submission.id,
            'student_id': student.id,
            'student_name': student.username,
            'assignment_id': assignment.id,
            'assignment_title': assignment.title,
            'submission_text': submission.submission_text,
            'document_url': submission.document_url,
            'submission_link': submission.submission_link,
            'submitted_at': submission.submitted_at.isoformat(),
            'grade': submission.grade,
            'feedback': submission.feedback
        })

    return jsonify(formatted_submissions)

@app.route('/api/submissions/<int:submission_id>/grade', methods=['POST'])
@token_required
def grade_submission(current_user, submission_id):
    # Get the submission
    submission = Submission.query.get_or_404(submission_id)
    
    # Get the assignment and unit to verify teacher's authority
    assignment = Assignment.query.get(submission.assignment_id)
    unit = Unit.query.get(assignment.unit_id)
    
    # Verify the current user is the teacher of this unit
    if current_user.id != unit.teacher_id or current_user.role != 'teacher':
        return jsonify({'error': 'Unauthorized access'}), 403

    # Get grade and feedback from request
    data = request.get_json()
    grade = data.get('grade')
    feedback = data.get('feedback')

    if grade is None:
        return jsonify({'error': 'Grade is required'}), 400

    # Update submission
    submission.grade = grade
    submission.feedback = feedback
    db.session.commit()

    return jsonify({
        'message': 'Submission graded successfully',
        'submission_id': submission.id,
        'grade': grade,
        'feedback': feedback
    })

@app.route('/api/submissions', methods=['POST'])
@token_required
def create_submission(current_user):
    try:
        # Ensure upload folder exists
        UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads', 'submissions')
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)

        # Check if request contains form data
        data = request.form.to_dict()

        # Validate required fields
        assignment_id = data.get('assignment_id')
        if not assignment_id:
            return jsonify({'error': 'Assignment ID is required'}), 400

        # Verify assignment exists
        assignment = Assignment.query.get(int(assignment_id))
        if not assignment:
            return jsonify({'error': 'Assignment not found'}), 404

        # Check if student is enrolled in the unit
        enrollment = Enrollment.query.filter_by(
            student_id=current_user.id, 
            unit_id=assignment.unit_id
        ).first()
        
        if not enrollment:
            return jsonify({'error': 'You are not enrolled in this unit'}), 403

        # Prepare submission details
        submission_text = data.get('submission_text', '')
        submission_link = data.get('submission_link', '')
        document_url = None

        # Handle file upload if present
        if 'document' in request.files:
            file = request.files['document']
            if file and file.filename:
                # Generate unique filename
                filename = secure_filename(f"{current_user.id}_{assignment_id}_{file.filename}")
                file_path = os.path.join(UPLOAD_FOLDER, filename)
                
                # Save file
                file.save(file_path)
                document_url = f"/uploads/submissions/{filename}"

        # Validate submission type
        if not (submission_text or document_url or submission_link):
            return jsonify({'error': 'Please provide a submission (text, file, or link)'}), 400

        # Create new submission
        new_submission = Submission(
            assignment_id=int(assignment_id),
            student_id=current_user.id,
            submission_text=submission_text,
            document_url=document_url,
            submission_link=submission_link,  # Add this to your Submission model
            submitted_at=datetime.utcnow(),
            grade=None,
            feedback=None
        )

        # Add to database
        db.session.add(new_submission)
        db.session.commit()

        return jsonify({
            'message': 'Submission created successfully',
            'submission_id': new_submission.id,
            'assignment_id': assignment_id
        }), 201

    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Submission error: {str(e)}")
        return jsonify({
            'error': 'An unexpected error occurred',
            'details': str(e)
        }), 500


@app.route('/api/student/performance/<int:student_id>', methods=['GET'])
@token_required
def get_student_performance(current_user, student_id):
    # Ensure the logged-in user is viewing their own performance and is a student
    if current_user.id != student_id or current_user.role != 'student':
        return jsonify({'error': 'Unauthorized access'}), 403

    try:
        # Fetch all enrollments for the student
        enrollments = Enrollment.query.filter_by(student_id=student_id).all()

        # Prepare a dictionary to store performance data
        performance_data = {
            'cat_results': [],
            'overall_performance': [],
            'performance_trend': []
        }

        # Loop through each enrollment to collect data per unit
        for enrollment in enrollments:
            unit = enrollment.unit

            # Collect CAT (Continuous Assessment Test) results (exam results)
            cat_result = {
                'unit_id': unit.id,
                'unit_title': unit.title,
                'cat_score': enrollment.cat_score,
                'max_cat_score': 100  # Assuming the maximum CAT score is 100
            }
            performance_data['cat_results'].append(cat_result)

            # Collect overall performance for the unit
            performance = Performance.query.filter_by(
                user_id=student_id, 
                unit_id=unit.id
            ).first()
            if performance:
                overall_result = {
                    'unit_id': unit.id,
                    'unit_title': unit.title,
                    'score': performance.score,
                    'trend_data': performance.trend_data
                }
                performance_data['overall_performance'].append(overall_result)
                # If trend_data is provided (expected as a list), add it to the overall trend
                if performance.trend_data:
                    performance_data['performance_trend'].extend(performance.trend_data)

        return jsonify(performance_data), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/api/student/submissions', methods=['GET'])
@token_required
def get_student_submissions(current_user):
    # Only students can view their submissions
    if current_user.role != 'student':
        return jsonify({'error': 'Unauthorized access'}), 403

    try:
        # Query for all submissions made by the current student
        submissions = Submission.query.filter_by(student_id=current_user.id).all()
        results = []
        for sub in submissions:
            # Access assignment details via backref and then the corresponding unit via assignment's backref
            assignment = sub.assignment  
            unit = assignment.unit if assignment else None

            results.append({
                'submission_id': sub.id,
                'assignment_id': assignment.id if assignment else None,
                'assignment_title': assignment.title if assignment else 'N/A',
                'unit_title': unit.title if unit else 'N/A',
                'submission_text': sub.submission_text,
                'document_url': sub.document_url,
                'submission_link': sub.submission_link,
                'submitted_at': sub.submitted_at.isoformat(),
                'grade': sub.grade if sub.grade is not None else 'Not graded',
                'feedback': sub.feedback or 'No feedback yet'
            })
        return jsonify(results), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/student/results/<int:student_id>', methods=['GET'])
@token_required
def get_student_results(current_user, student_id):
    # Ensure that the logged-in user is accessing their own results and is a student.
    if current_user.id != student_id or current_user.role != 'student':
        return jsonify({'error': 'Unauthorized access'}), 403

    try:
        enrollments = Enrollment.query.filter_by(student_id=student_id).all()
        results = []
        trend_data = []

        for enrollment in enrollments:
            unit = enrollment.unit  # Using the backref to fetch the related Unit
            # Calculate an overall score if any of the individual scores are available.
            scores = []
            if enrollment.assignment_score is not None:
                scores.append(enrollment.assignment_score)
            if enrollment.cat_score is not None:
                scores.append(enrollment.cat_score)
            if enrollment.exam_score is not None:
                scores.append(enrollment.exam_score)
            overall_score = round(sum(scores) / len(scores), 2) if scores else None

            record = {
                'unit_id': unit.id,
                'unit_title': unit.title,
                'grade': enrollment.grade,
                'feedback': enrollment.feedback,
                'progress': enrollment.progress,
                'assignment_score': enrollment.assignment_score,
                'cat_score': enrollment.cat_score,
                'exam_score': enrollment.exam_score,
                'overall_score': overall_score,
                'enrollment_date': enrollment.enrollment_date.isoformat()
            }
            results.append(record)
            trend_data.append({
                'timestamp': enrollment.enrollment_date.isoformat(),
                'overall_score': overall_score
            })

        # Sort the trend summary by enrollment date (timestamp)
        trend_data = sorted(trend_data, key=lambda x: x['timestamp'])

        return jsonify({
            'results': results,
            'trend_summary': trend_data
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500



if __name__ == '__main__':
    app.run(port=5000, debug=True)
