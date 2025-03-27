import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TeacherSidebar from './sidebar';
import axios from 'axios';

function TeacherDashboard() {
    const [dashboardData, setDashboardData] = useState({
        totalUnits: 0,
        totalStudents: 0,
        recentActivities: []
    });

    useEffect(() => {
        const teacherId = localStorage.getItem('user_id');
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/teacher/dashboard/${teacherId}`, {
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
        <div className='container mt-4' id='dash'>
            <div className='row'>
                <aside className="col-md-2">
                    <TeacherSidebar />
                </aside>
                <section className="col-md-9">
                    <h5 className='bold mb-4' style={{ color: 'dark' }}>Teacher Dashboard</h5>
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="card bg-primary text-white">
                                <div className="card-body">
                                    <h5 className="card-title">Total Units</h5>
                                    <h2 className="card-text">{dashboardData.totalUnits}</h2>
                                    <Link to="/te-units" className="text-white">View All Units →</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card bg-success text-white">
                                <div className="card-body">
                                    <h5 className="card-title">Total Students</h5>
                                    <h2 className="card-text">{dashboardData.totalStudents}</h2>
                                    <Link to="/my-users" className="text-white">View All Students →</Link>
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

export default TeacherDashboard;
