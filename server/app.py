from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from flasgger import Swagger
from flask_migrate import Migrate
from datetime import datetime, timedelta
import os
from database import db, init_db
from sqlalchemy import func

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(os.path.abspath(os.path.dirname(__file__)), 'lms.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET', 'super-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=5)

# Initialize extensions
init_db(app)
jwt = JWTManager(app)
swagger = Swagger(app)
migrate = Migrate(app, db)

# Import models after db initialization to avoid circular imports
from models import User, Unit, Enrollment, Rating

# Create database tables
with app.app_context():
    db.create_all()

@app.route('/')
def welcome():
    return "Welcome to the LMS API!"


# Authentication routes
@app.route('/api/login', methods=['POST'])
def login():
    
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    access_token = create_access_token(identity=user.id)
    return jsonify({
        'access_token': access_token,
        'user_id': user.id,
        'role': user.role
    })

@app.route('/api/teacher/login', methods=['POST', 'OPTIONS'])
def teacher_login():
    if request.method == 'OPTIONS':
        return '', 200
        
    data = request.get_json()
    user = User.query.filter_by(email=data['email'], role='teacher').first()
    
    if not user:
        return jsonify({'error': 'Teacher account not found'}), 404
    
    if not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    access_token = create_access_token(identity=user.id)
    return jsonify({
        'access_token': access_token,
        'user_id': user.id,
        'role': user.role
    })

@app.route('/api/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return '', 204

    data = request.get_json()
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
    
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/api/teacher/register', methods=['POST', 'OPTIONS'])
def teacher_register():
    if request.method == 'OPTIONS':
        return '', 204

    data = request.get_json()
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
    
    return jsonify({'message': 'Teacher registered successfully'}), 201

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
@jwt_required()
def create_enrollment():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    enrollment = Enrollment(
        student_id=current_user_id,
        unit_id=data['unit_id'],
        enrollment_date=datetime.utcnow()
    )
    db.session.add(enrollment)
    db.session.commit()
    
    return jsonify({'message': 'Enrollment successful'}), 201

@app.route('/api/ratings', methods=['POST'])
@jwt_required()
def create_rating():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    rating = Rating(
        unit_id=data['unit_id'],
        user_id=current_user_id,
        score=data['score'],
        comment=data.get('comment')
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
            'assignments': [{
                'id': assignment.id,
                'title': assignment.title
            } for assignment in unit.assignments]
        }

        return jsonify(unit_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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
@jwt_required()
def get_student_dashboard(student_id):
    if request.method == 'OPTIONS':
        return '', 204
        
    current_user_id = get_jwt_identity()
    if current_user_id != student_id:
        return jsonify({'error': 'Unauthorized access'}), 403

    try:
        # Get enrolled courses count
        enrolled_courses = Enrollment.query.filter_by(student_id=student_id).count()

        # Get completed courses count (assuming a course is completed when progress is 100%)
        completed_courses = Enrollment.query.filter_by(
            student_id=student_id,
            progress=100
        ).count()

        # Calculate average score from all assignments
        enrollments = Enrollment.query.filter_by(student_id=student_id).all()
        total_score = 0
        total_assignments = 0
        for enrollment in enrollments:
            if enrollment.score is not None:
                total_score += enrollment.score
                total_assignments += 1
        average_score = round(total_score / total_assignments * 100) if total_assignments > 0 else 0

        # Get recent activities
        recent_enrollments = Enrollment.query\
            .filter_by(student_id=student_id)\
            .order_by(Enrollment.enrollment_date.desc())\
            .limit(5)\
            .all()

        recent_activities = [{
            'description': f"Enrolled in {enrollment.unit.title}",
            'date': enrollment.enrollment_date.strftime('%Y-%m-%d %H:%M')
        } for enrollment in recent_enrollments]

        return jsonify({
            'enrolledCourses': enrolled_courses,
            'completedCourses': completed_courses,
            'averageScore': average_score,
            'recentActivities': recent_activities
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/student/units/<int:student_id>', methods=['GET', 'OPTIONS'])
@jwt_required()
def get_student_units(student_id):
    if request.method == 'OPTIONS':
        return '', 204

    current_user_id = get_jwt_identity()
    if current_user_id != student_id:
        return jsonify({'error': 'Unauthorized access'}), 403

    try:
        # Validate student exists
        student = User.query.filter_by(id=student_id, role='student').first()
        if not student:
            return jsonify({'error': 'Student not found'}), 404

        # Validate and process pagination parameters with defaults
        try:
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 10, type=int)
            
            # Validate pagination parameters
            if not isinstance(page, int) or not isinstance(per_page, int):
                return jsonify({'error': 'Pagination parameters must be integers'}), 422
            if page < 1:
                return jsonify({'error': 'Page number must be greater than 0'}), 422
            if per_page < 1 or per_page > 50:
                return jsonify({'error': 'Items per page must be between 1 and 50'}), 422
        except (TypeError, ValueError):
            return jsonify({'error': 'Invalid pagination parameters'}), 422

        # Get enrolled units with pagination
        enrollments = Enrollment.query\
            .filter_by(student_id=student_id)\
            .join(Unit)\
            .join(User, Unit.teacher_id == User.id)\
            .add_columns(
                Unit.id,
                Unit.title,
                Unit.category,
                User.username.label('teacher_name'),
                Enrollment.enrollment_date,
                Enrollment.progress
            )\
            .paginate(page=page, per_page=per_page, error_out=False)

        # Return empty results if no enrollments found
        if not enrollments.items:
            return jsonify({
                'units': [],
                'total': 0,
                'pages': 0,
                'current_page': page
            })

        units_data = [{
            'id': unit.id,
            'title': unit.title,
            'category': unit.category,
            'teacher': unit.teacher_name,
            'enrollmentDate': enrollment.enrollment_date.strftime('%Y-%m-%d'),
            'progress': enrollment.progress or 0
        } for enrollment, unit in enrollments.items]

        return jsonify({
            'units': units_data,
            'total': enrollments.total,
            'pages': enrollments.pages,
            'current_page': page
        })

    except Exception as e:
        return jsonify({'error': 'An error occurred while fetching student units'}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
