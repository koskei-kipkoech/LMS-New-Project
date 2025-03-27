import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {  Form, Button, Alert } from 'react-bootstrap';
import TeacherSidebar from './sidebar';

const AddAssignment = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        due_date: '',
        max_score: '',
        unit_id: ''
    });
    const [units, setUnits] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch teacher's units
        const fetchUnits = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/teacher/units', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUnits(response.data);
            } catch (err) {
                setError('Failed to fetch units');
            }
        };

        fetchUnits();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Format the date to match backend expectations
            const formattedData = {
                ...formData,
                due_date: formData.due_date.replace('T', ' '),
                max_score: parseFloat(formData.max_score)
            };

            await axios.post('http://localhost:5000/api/assignments', formattedData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            setSuccess(true);
            setError('');
            // Reset form
            setFormData({
                title: '',
                description: '',
                due_date: '',
                max_score: '',
                unit_id: ''
            });
            setTimeout(() => {
                navigate('/teacher-dashboard');
            }, 2000);
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to create assignment';
            setError(errorMessage);
            console.error('Assignment creation error:', err.response?.data);
        }
    };

    return (
        <div className='container mt-4'>
            <div className='row'>
                <aside className="col-md-2">
                    <TeacherSidebar/>
                </aside>
                <section className="col-md-9">
                    <div className='card'>
                        <h5 className='card-header'>Add New Assignment</h5>
                        <div className='card-body'>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">Assignment created successfully!</Alert>}
                            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Select Unit</Form.Label>
                    <Form.Control
                        as="select"
                        name="unit_id"
                        value={formData.unit_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Choose a unit...</option>
                        {units.map(unit => (
                            <option key={unit.id} value={unit.id}>
                                {unit.title}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Assignment Title</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        maxLength={120}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Due Date</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        name="due_date"
                        value={formData.due_date}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Maximum Score</Form.Label>
                    <Form.Control
                        type="number"
                        name="max_score"
                        value={formData.max_score}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.1"
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Create Assignment
                </Button>
                            </Form>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AddAssignment;