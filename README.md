# Learning Management System (LMS)

A comprehensive Learning Management System built with React (frontend) and Flask (backend) that facilitates online learning and teaching.

## Features

- **User Authentication**

  - Separate login/registration for teachers and students
  - Secure authentication system
  - Profile management

- **Teacher Features**

  - Create and manage units
  - Add assignments
  - Track student performance
  - View submitted assignments
  - Manage student enrollments

- **Student Features**

  - Access learning units
  - Submit assignments
  - Track progress
  - View grades and feedback

- **Course Management**
  - Organized unit structure
  - Assignment submission system
  - Performance tracking
  - Resource sharing

## Tech Stack

### Frontend

- React.js
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests

### Backend

- Flask (Python)
- SQLite Database
- Flask-SQLAlchemy
- Flask Migrations

## Prerequisites

- Node.js (v14 or higher)
- Python 3.x
- pip (Python package manager)
- Git

## Installation

### Frontend Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd lms_frontend/client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to the server directory:

   ```bash
   cd ../server
   ```

2. Create and activate a virtual environment:

   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
   ```

3. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Initialize the database:

   ```bash
   python seed.py
   ```

5. Start the Flask server:
   ```bash
   python app.py
   ```
   The API will be available at `http://localhost:5000`

## Project Structure

```
lms_frontend/
├── client/               # React frontend
│   ├── public/           # Static files
│   └── src/
│       ├── components/   # React components
│       └── services/     # API services
└── server/              # Flask backend
    ├── migrations/      # Database migrations
    ├── app.py          # Main application file
    ├── models.py       # Database models
    └── database.py     # Database configuration
```

## Usage

### For Teachers

1. Register/Login through the teacher portal
2. Access the teacher dashboard
3. Create and manage units
4. Add assignments and track submissions
5. Monitor student performance

### For Students

1. Register/Login through the student portal
2. Browse available units
3. Access learning materials
4. Submit assignments
5. Track progress and view grades

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

For support, please open an issue in the repository or contact the development team.
