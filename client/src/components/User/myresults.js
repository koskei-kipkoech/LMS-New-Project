import React, { useState, useEffect } from 'react';
import TeacherSidebar from './sidebar';
import axios from 'axios';

function MyResults() {
    const [submissions, setSubmissions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
                const response = await axios.get('http://localhost:5000/api/student/submissions', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setSubmissions(response.data);
                setIsLoading(false);
            } catch (err) {
                setError('Failed to fetch submissions');
                setIsLoading(false);
                console.error(err);
            }
        };

        fetchSubmissions();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='container mt-4'>
            <div className='row'>
                <aside className="col-md-2">
                    <TeacherSidebar />
                </aside>
                <section className="col-md-10">
                    <div className='card'>
                        <h5 className='card-header'>My Assignment Results</h5>
                        <div className='card-body'>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th>Assignment</th>
                                        <th>Unit</th>
                                        <th>Submission Date</th>
                                        <th>Grade</th>
                                        <th>Feedback</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.map((submission) => (
                                        <tr key={submission.submission_id}>
                                            <td>{submission.assignment_title}</td>
                                            <td>{submission.unit_title}</td>
                                            <td>{new Date(submission.submitted_at).toLocaleDateString()}</td>
                                            <td>{submission.grade !== null ? submission.grade : 'Not graded'}</td>
                                            <td>{submission.feedback || 'No feedback yet'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default MyResults;
