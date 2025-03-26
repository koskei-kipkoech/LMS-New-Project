import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TeacherSidebar from './sidebar';
import axios from 'axios';

function MyUsers() {
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const teacherId = localStorage.getItem('user_id');
        const fetchEnrolledStudents = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/teacher/enrolled-students/${teacherId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
                setEnrolledStudents(response.data.enrolled_students);
                setError(null);
            } catch (err) {
                setError('Failed to load enrolled students');
                console.error('Error fetching enrolled students:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchEnrolledStudents();
    }, []);

    if (loading) return (
        <div className='container mt-4'>
            <div className='row'>
                <aside className="col-md-2">
                    <TeacherSidebar/>
                </aside>
                <section className="col-md-9">
                    <div className="text-center mt-5">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );

    return (
        <div className='container mt-4'>
            <div className='row'>
                <aside className="col-md-2">
                    <TeacherSidebar/>
                </aside>
                <section className="col-md-9">
                    <div className='card'>
                        <h5 className='card-header'>My Users</h5>
                        <div className='card-body'>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th>Student Name</th>
                                        <th>Enrolled Unit</th>
                                        <th>Email</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {enrolledStudents.map((student, index) => (
                                        <tr key={student.enrollment_id}>
                                            <td>{student.student_name}</td>
                                            <td><Link to={`/unit/${student.unit_id}`}>{student.unit_title}</Link></td>
                                            <td>{student.username}</td>
                                            <td>
                                                <button className='btn btn-danger btn-sm'>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {enrolledStudents.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center">No enrolled students found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default MyUsers;