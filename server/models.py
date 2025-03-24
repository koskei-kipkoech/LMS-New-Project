from database import db
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy import select, func
from datetime import datetime
import bcrypt

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'teacher' or 'student'
    bio = db.Column(db.Text)
    qualifications = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    created_units = db.relationship('Unit', backref='teacher', lazy=True)
    ratings = db.relationship('Rating', backref='student', lazy=True)
    enrollments = db.relationship('Enrollment', backref='student', lazy=True)
    performance = db.relationship('Performance', backref='user', lazy=True)
    profile_settings = db.relationship('ProfileSettings', backref='user', uselist=False, lazy=True)

    def set_password(self, password):
        password_bytes = password.encode('utf-8')
        salt = bcrypt.gensalt()
        self.password_hash = bcrypt.hashpw(password_bytes, salt).decode('utf-8')

    def check_password(self, password):
        password_bytes = password.encode('utf-8')
        return bcrypt.checkpw(password_bytes, self.password_hash.encode('utf-8'))

    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'bio': self.bio,
            'qualifications': self.qualifications,
            'total_units': len(self.created_units),
            'total_students': sum(len(unit.enrollments) for unit in self.created_units)
        }

class Unit(db.Model):
    
    @hybrid_property
    def average_rating(self):
        if self.ratings:
            return sum(r.score for r in self.ratings) / len(self.ratings)
        return 0.0

    @average_rating.expression
    def average_rating(cls):
        return select(func.avg(Rating.score)).where(Rating.unit_id == cls.id).label('average_rating')

    @hybrid_property
    def rating_count(self):
        return len(self.ratings) if self.ratings else 0

    @rating_count.expression
    def rating_count(cls):
        return select(func.count(Rating.id)).where(Rating.unit_id == cls.id).label('rating_count')
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50))
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    teacher_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


    # Relationships
    enrollments = db.relationship('Enrollment', backref='unit', lazy=True)
    ratings = db.relationship('Rating', backref='unit', lazy=True)
    assignments = db.relationship('Assignment', backref='unit', lazy=True)

    def __repr__(self):
        return f'<Unit {self.title}>'

class Enrollment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    unit_id = db.Column(db.Integer, db.ForeignKey('unit.id'), nullable=False)
    enrollment_date = db.Column(db.DateTime, default=datetime.utcnow)
    grade = db.Column(db.Float)
    feedback = db.Column(db.Text)

    def __repr__(self):
        return f'<Enrollment {self.student_id}-{self.unit_id}>'

class Performance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    unit_id = db.Column(db.Integer, db.ForeignKey('unit.id'), nullable=False)
    score = db.Column(db.Float)
    date_recorded = db.Column(db.DateTime, default=datetime.utcnow)
    trend_data = db.Column(db.JSON)

    def __repr__(self):
        return f'<Performance {self.user_id}-{self.unit_id}>'

class ProfileSettings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    notifications_enabled = db.Column(db.Boolean, default=True)
    theme = db.Column(db.String(20), default='light')
    language = db.Column(db.String(10), default='en')

    def __repr__(self):
        return f'<ProfileSettings {self.user_id}>'

class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    unit_id = db.Column(db.Integer, db.ForeignKey('unit.id'), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Rating {self.score} for Unit {self.unit_id}>'

class Assignment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    unit_id = db.Column(db.Integer, db.ForeignKey('unit.id'), nullable=False)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text)
    due_date = db.Column(db.DateTime)
    max_score = db.Column(db.Float)

    def __repr__(self):
        return f'<Assignment {self.title}>'