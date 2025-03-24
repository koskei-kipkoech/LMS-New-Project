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

if __name__ == '__main__':
    app.run(port=5000, debug=True)
