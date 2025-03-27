import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './sidebar';

function MyMoodle() {
    const [assignments, setAssignments] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState('');
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const studentId = localStorage.getItem('user_id');
                const response = await axios.get(`http://localhost:5000/api/student/${studentId}/units`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUnits(response.data);
            } catch (error) {
                console.error('Error fetching units:', error);
            }
        };
        fetchUnits();
    }, []);

    useEffect(() => {
        if (selectedUnit) {
            const fetchAssignments = async () => {
                try {
                    setLoading(true);
                    const studentId = localStorage.getItem('user_id');
                    const response = await axios.get(`http://localhost:5000/api/student/units/${selectedUnit}/assignments`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    setAssignments(response.data);
                } catch (error) {
                    console.error('Error fetching assignments:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchAssignments();
        }
    }, [selectedUnit]);

    return (
        <div className='container mt-4'>
            <div className='row'>
                <aside className="col-md-2">
                    <Sidebar />
                </aside>
                <section className="col-md-10">
                    <div className='card'>
                        <h5 className='card-header'>My Assignments</h5>
                        <div className='card-body'>
                            <div className='mb-4'>
                                <select
                                    className='form-select'
                                    value={selectedUnit}
                                    onChange={(e) => setSelectedUnit(e.target.value)}
                                >
                                    <option value=''>Select a Unit</option>
                                    {units.map(unit => (
                                        <option key={unit.id} value={unit.id}>{unit.title}</option>
                                    ))}
                                </select>
                            </div>
                            {loading ? (
                                <p>Loading assignments...</p>
                            ) : assignments.length > 0 ? (
                                <div className="list-group">
                                    {assignments.map(assignment => (
                                        <div key={assignment.id} className="list-group-item">
                                            <div className="d-flex w-100 justify-content-between align-items-center">
                                                <div>
                                                    <h6 className="mb-1">{assignment.title}</h6>
                                                    <p className="mb-1">{assignment.description}</p>
                                                    <small>Due Date: {new Date(assignment.due_date).toLocaleDateString()}</small>
                                                </div>
                                                <div className="text-end">
                                                    <span className={`badge ${assignment.completed ? 'bg-success' : 'bg-warning'}`}>
                                                        {assignment.completed ? 'Completed' : 'Pending'}
                                                    </span>
                                                    {!assignment.completed && (
                                                        <div className="mt-2">
                                                            <button className="btn btn-primary btn-sm">
                                                                Submit Assignment
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No assignments found for this unit.</p>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default MyMoodle;