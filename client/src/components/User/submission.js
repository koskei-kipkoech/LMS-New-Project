import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const SubmissionModal = ({ show, onHide, assignmentId }) => {
    const [submissionType, setSubmissionType] = useState('text');
    const [submissionText, setSubmissionText] = useState('');
    const [submissionFile, setSubmissionFile] = useState(null);
    const [submissionLink, setSubmissionLink] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleFileChange = (e) => {
        setSubmissionFile(e.target.files[0]);
    };

    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('assignment_id', assignmentId);
        formData.append('student_id', localStorage.getItem('user_id'));

        // Validate submission based on type
        if (submissionType === 'text' && submissionText) {
            formData.append('submission_text', submissionText);
        } else if (submissionType === 'file' && submissionFile) {
            formData.append('document', submissionFile);
        } else if (submissionType === 'link') {
            if (!isValidUrl(submissionLink)) {
                setError('Please enter a valid URL');
                return;
            }
            formData.append('submission_link', submissionLink);
        } else {
            setError('Please provide a submission');
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/submissions', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSuccess('Assignment submitted successfully!');
            // Clear form and close modal after a short delay
            setTimeout(() => {
                onHide();
                // Reset form state
                setSubmissionType('text');
                setSubmissionText('');
                setSubmissionFile(null);
                setSubmissionLink('');
            }, 1500);
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to submit assignment. Please try again.');
            console.error('Submission error:', error);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Submit Assignment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                
                <Form.Group className="mb-3">
                    <Form.Label>Submission Type</Form.Label>
                    <Form.Select 
                        value={submissionType} 
                        onChange={(e) => setSubmissionType(e.target.value)}
                    >
                        <option value="text">Text Submission</option>
                        <option value="file">File Upload</option>
                        <option value="link">Document Link</option>
                    </Form.Select>
                </Form.Group>

                <Form onSubmit={handleSubmit}>
                    {submissionType === 'text' && (
                        <Form.Group className="mb-3">
                            <Form.Label>Submission Text</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={submissionText}
                                onChange={(e) => setSubmissionText(e.target.value)}
                                placeholder="Add your submission text"
                            />
                        </Form.Group>
                    )}

                    {submissionType === 'file' && (
                        <Form.Group className="mb-3">
                            <Form.Label>Upload Document</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handleFileChange}
                            />
                        </Form.Group>
                    )}

                    {submissionType === 'link' && (
                        <Form.Group className="mb-3">
                            <Form.Label>Document Link</Form.Label>
                            <Form.Control
                                type="url"
                                value={submissionLink}
                                onChange={(e) => setSubmissionLink(e.target.value)}
                                placeholder="Paste your document link (Google Docs, OneDrive, etc.)"
                            />
                        </Form.Group>
                    )}

                    <Button variant="primary" type="submit" className="w-100">
                        Submit Assignment
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default SubmissionModal;