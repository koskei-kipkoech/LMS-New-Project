import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const SubmissionModal = ({ show, onHide, assignmentId, onSubmissionComplete }) => {
    const [submissionType, setSubmissionType] = useState('text');
    const [submissionText, setSubmissionText] = useState('');
    const [submissionFile, setSubmissionFile] = useState(null);
    const [submissionLink, setSubmissionLink] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('assignment_id', assignmentId);
        formData.append('student_id', localStorage.getItem('user_id'));

        // Validate submission based on type
        if (submissionType === 'text' && submissionText.trim()) {
            formData.append('submission_text', submissionText);
        } else if (submissionType === 'file' && submissionFile) {
            formData.append('document', submissionFile);
        } else if (submissionType === 'link') {
            if (!isValidUrl(submissionLink)) {
                setError('Please enter a valid URL');
                setIsSubmitting(false);
                return;
            }
            formData.append('submission_link', submissionLink);
        } else {
            setError('Please provide a submission');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/submissions', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSuccess('Assignment submitted successfully!');
            
            // Call the callback to update assignment status
            if (onSubmissionComplete) {
                onSubmissionComplete(assignmentId);
            }

            // Clear form and close modal after a short delay
            setTimeout(() => {
                onHide();
                // Reset form state
                setSubmissionType('text');
                setSubmissionText('');
                setSubmissionFile(null);
                setSubmissionLink('');
                setIsSubmitting(false);
            }, 1500);
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to submit assignment. Please try again.');
            console.error('Submission error:', error);
            setIsSubmitting(false);
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
                        disabled={isSubmitting}
                    >
                        <option value="text">Text Submission</option>
                        <option value="link">Document Link</option>
                        <option value="file">File Upload(Not Reccomended)</option>
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
                                disabled={isSubmitting}
                            />
                        </Form.Group>
                    )}

                    {submissionType === 'file' && (
                        <Form.Group className="mb-3">
                            <Form.Label>Upload Document</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handleFileChange}
                                disabled={isSubmitting}
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
                                disabled={isSubmitting}
                            />
                        </Form.Group>
                    )}

                    <Button 
                        variant="primary" 
                        type="submit" 
                        className="w-100"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default SubmissionModal;