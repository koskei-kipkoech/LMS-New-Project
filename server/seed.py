from faker import Faker
from app import app
from database import db
from models import User, Unit, Enrollment, Rating, Performance, ProfileSettings, Assignment
from datetime import datetime, timedelta
import random

fake = Faker()

def seed_data():
    with app.app_context():
        # Create sample users (teachers)
        teachers = []
        for _ in range(3):
            teacher = User(
                username=fake.user_name(),
                email=fake.email(),
                role='teacher',
                bio=fake.text(max_nb_chars=200),
                qualifications=fake.text(max_nb_chars=100)
            )
            teacher.set_password('password123')
            teachers.append(teacher)
        
        # Create sample users (students)
        students = []
        for _ in range(10):
            student = User(
                username=fake.user_name(),
                email=fake.email(),
                role='student',
                bio=fake.text(max_nb_chars=200)
            )
            student.set_password('password123')
            students.append(student)
        
        db.session.add_all(teachers + students)
        db.session.commit()

        # Create sample units
        units = []
        categories = ['Programming', 'Web Development', 'Data Science', 'Machine Learning', 'DevOps']
        for _ in range(8):
            start_date = fake.date_time_between(start_date='-1y', end_date='+30d')
            unit = Unit(
                title=fake.catch_phrase(),
                description=fake.text(max_nb_chars=300),
                category=random.choice(categories),
                start_date=start_date,
                end_date=start_date + timedelta(days=random.randint(30, 90)),
                teacher_id=random.choice(teachers).id
            )
            units.append(unit)
        
        db.session.add_all(units)
        db.session.commit()

        # Create enrollments and ratings
        enrollments = []
        ratings = []
        for student in students:
            # Each student enrolls in 2-5 random units
            student_units = random.sample(units, random.randint(2, 5))
            for unit in student_units:
                # Create enrollment
                enrollment_date = fake.date_time_between(
                    start_date=unit.start_date,
                    end_date=min(unit.end_date, datetime.utcnow())
                )
                grade = random.uniform(60, 100) if unit.end_date < datetime.utcnow() else None
                enrollment = Enrollment(
                    student_id=student.id,
                    unit_id=unit.id,
                    enrollment_date=enrollment_date,
                    grade=grade,
                    feedback=fake.text(max_nb_chars=100) if grade else None
                )
                enrollments.append(enrollment)

                # Create rating (50% chance)
                if random.random() > 0.5:
                    rating = Rating(
                        student_id=student.id,
                        unit_id=unit.id,
                        score=random.randint(1, 5),
                        created_at=fake.date_time_between(
                            start_date=enrollment_date,
                            end_date=datetime.utcnow()
                        )
                    )
                    ratings.append(rating)

        db.session.add_all(enrollments + ratings)
        db.session.commit()

        # Create performance records
        performances = []
        for enrollment in enrollments:
            if enrollment.grade:  # Only create performance for graded enrollments
                performance = Performance(
                    user_id=enrollment.student_id,
                    unit_id=enrollment.unit_id,
                    score=enrollment.grade,
                    date_recorded=fake.date_time_between(
                        start_date=enrollment.enrollment_date,
                        end_date=datetime.utcnow()
                    ),
                    trend_data={'weekly_progress': [random.randint(60, 100) for _ in range(4)]}
                )
                performances.append(performance)

        db.session.add_all(performances)
        db.session.commit()

        # Create profile settings
        profile_settings = []
        themes = ['light', 'dark', 'auto']
        languages = ['en', 'es', 'fr', 'de']
        for user in teachers + students:
            settings = ProfileSettings(
                user_id=user.id,
                notifications_enabled=random.choice([True, False]),
                theme=random.choice(themes),
                language=random.choice(languages)
            )
            profile_settings.append(settings)

        db.session.add_all(profile_settings)
        db.session.commit()

        # Create assignments
        assignments = []
        for unit in units:
            num_assignments = random.randint(2, 5)
            for _ in range(num_assignments):
                due_date = fake.date_time_between(
                    start_date=unit.start_date,
                    end_date=unit.end_date
                )
                assignment = Assignment(
                    unit_id=unit.id,
                    title=fake.sentence(nb_words=4),
                    description=fake.text(max_nb_chars=200),
                    due_date=due_date,
                    max_score=random.choice([10, 20, 25, 50, 100])
                )
                assignments.append(assignment)

        db.session.add_all(assignments)
        db.session.commit()

if __name__ == '__main__':
    seed_data()
    print('Database seeded successfully!')