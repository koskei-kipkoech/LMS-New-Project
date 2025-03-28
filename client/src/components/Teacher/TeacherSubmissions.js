import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import TeacherSidebar from './sidebar';

function TeacherSubmissions() {
    const [units, setUnits] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState('');
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showGradingModal, setShowGradingModal] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [grade, setGrade] = useState('');
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        const fetchTeacherUnits = async () => {
            try {
                const teacherId = localStorage.getItem('user_id');
                const response = await axios.get(`http://localhost:5000/api/teacher/${teacherId}/units`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUnits(response.data);
            } catch (error) {
                console.error('Error fetching units:', error);
                setError('Failed to fetch units');
            }
        };
        fetchTeacherUnits();
    }, []);

    useEffect(() => {
        if (selectedUnit) {
            const fetchSubmissions = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(`http://localhost:5000/api/teacher/units/${selectedUnit}/submissions`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    setSubmissions(response.data);
                } catch (error) {
                    console.error('Error fetching submissions:', error);
                    setError('Failed to fetch submissions');
                } finally {
                    setLoading(false);
                }
            };
            fetchSubmissions();
        }
    }, [selectedUnit]);

    const handleGradeSubmission = async () => {
        try {
            await axios.post(`http://localhost:5000/api/submissions/${selectedSubmission.id}/grade`, {
                grade: parseFloat(grade),
                feedback
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Update the submissions list with the new grade
            setSubmissions(submissions.map(sub =>
                sub.id === selectedSubmission.id
                    ? { ...sub, grade: parseFloat(grade), feedback }
                    : sub
            ));

            setShowGradingModal(false);
            setSelectedSubmission(null);
            setGrade('');
            setFeedback('');
        } catch (error) {
            console.error('Error grading submission:', error);
            setError('Failed to grade submission');
        }
    };

    const openGradingModal = (submission) => {
        setSelectedSubmission(submission);
        setGrade(submission.grade || '');
        setFeedback(submission.feedback || '');
        setShowGradingModal(true);
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <aside className="col-md-2">
                    <TeacherSidebar />
                </aside>
                <section className="col-md-9">
                    <h2>Student Submissions</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <div className="mb-4">
                        <select
                            className="form-select"
                            value={selectedUnit}
                            onChange={(e) => setSelectedUnit(e.target.value)}
                        >
                            <option value="">Select a Unit</option>
                            {units.map(unit => (
                                <option key={unit.id} value={unit.id}>{unit.title}</option>
                            ))}
                        </select>
                    </div>

                    {loading ? (
                        <p>Loading submissions...</p>
                    ) : submissions.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Student</th>
                                        <th>Assignment</th>
                                        <th>Submission Type</th>
                                        <th>Submitted At</th>
                                        <th>Grade</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.map(submission => (
                                        <tr key={submission.id}>
                                            <td>{submission.student_name}</td>
                                            <td>{submission.assignment_title}</td>
                                            <td>
                                                {submission.submission_text ? 'Text' :
                                                 submission.document_url ? 'File' :
                                                 submission.submission_link ? 'Link' : 'N/A'}
                                            </td>
                                            <td>{new Date(submission.submitted_at).toLocaleDateString()}</td>
                                            <td>{submission.grade || 'Not graded'}</td>
                                            <td>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => openGradingModal(submission)}
                                                >
                                                    {submission.grade ? 'Update Grade' : 'Grade'}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No submissions found for this unit.</p>
                    )}

                    <Modal show={showGradingModal} onHide={() => setShowGradingModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Grade Submission</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedSubmission && (
                                <div>
                                    <h6>Submission Details</h6>
                                    {selectedSubmission.submission_text && (
                                        <div className="mb-3">
                                            <label className="fw-bold">Text Submission:</label>
                                            <p>{selectedSubmission.submission_text}</p>
                                        </div>
                                    )}
                                    {selectedSubmission.submission_link && (
                                        <div className="mb-3">
                                            <label className="fw-bold">Submission Link:</label>
                                            <a href={selectedSubmission.submission_link} target="_blank" rel="noopener noreferrer">
                                                View Submission
                                            </a>
                                        </div>
                                    )}
                                    {selectedSubmission.document_url && (
                                        <div className="mb-3">
                                            <label className="fw-bold">Document:</label>
                                            <a href={selectedSubmission.document_url} target="_blank" rel="noopener noreferrer">
                                                View Document
                                            </a>
                                        </div>
                                    )}
                                    <Form>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Grade</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={grade}
                                                onChange={(e) => setGrade(e.target.value)}
                                                min="0"
                                                max="100"
                                                step="0.1"
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Feedback</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                value={feedback}
                                                onChange={(e) => setFeedback(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Form>
                                </div>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowGradingModal(false)}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleGradeSubmission}>
                                Save Grade
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </section>
            </div>
        </div>
    );
}

export default TeacherSubmissions;