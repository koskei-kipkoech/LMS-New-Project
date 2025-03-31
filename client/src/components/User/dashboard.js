import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './sidebar';
import axios from 'axios';

function Dashboard() {
    const [dashboardData, setDashboardData] = useState({
        enrolledCourses: 0,
        completedCourses: 0,
        averageScore: 0,
        recentActivities: []
    });

    useEffect(() => {
        const studentId = localStorage.getItem('user_id');
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/student/dashboard/${studentId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setDashboardData(response.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <div className='container mt-4'>
            <div className='row'>
                <aside className="col-md-2">
                    <Sidebar />
                </aside>
                <section className="col-md-9">
                    <h5 className='bold mb-4'>Student Dashboard</h5>
                    <div className="row mb-4">
                        <div className="col-md-4">
                            <div className="card bg-primary text-white">
                                <div className="card-body">
                                    <h5 className="card-title">Enrolled Courses</h5>
                                    <h2 className="card-text">{dashboardData.enrolledCourses}</h2>
                                    <Link to="/my-units" className="text-white">
                                        View Courses →
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card bg-success text-white">
                                <div className="card-body">
                                    <h5 className="card-title">Completed Courses</h5>
                                    <h2 className="card-text">{dashboardData.completedCourses}</h2>
                                    <Link to="/my-units" className="text-white">
                                        View Details →
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card bg-info text-white">
                                <div className="card-body">
                                    <h5 className="card-title">Average Score</h5>
                                    <h2 className="card-text">{dashboardData.averageScore}%</h2>
                                    <Link to="/my-performance" className="text-white">
                                        View Performance →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">Recent Activities</h5>
                        </div>
                        <div className="card-body">
                            {dashboardData.recentActivities.length > 0 ? (
                                <ul className="list-group list-group-flush">
                                    {dashboardData.recentActivities.map((activity, index) => (
                                        <li key={index} className="list-group-item">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span>{activity.description}</span>
                                                <small className="text-muted">{activity.date}</small>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted mb-0">No recent activities</p>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Dashboard;
