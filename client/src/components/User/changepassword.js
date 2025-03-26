import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './sidebar';

function ChangePassword() {
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        email: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        // Fetch user email from session
        const fetchUserEmail = async () => {
            try {
                const userId = localStorage.getItem('user_id');
                const response = await axios.get(
                    `http://localhost:5000/api/users/${userId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
                setPasswordData(prev => ({
                    ...prev,
                    email: response.data.email
                }));
            } catch (error) {
                console.error('Error fetching user email:', error);
                setMessage({ type: 'error', text: 'Failed to load user data' });
            }
        };

        fetchUserEmail();
    }, []);

    const handleChange = (event) => {
        setPasswordData({
            ...passwordData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Validation
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match!' });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters long!' });
            return;
        }

        try {
            const userId = localStorage.getItem('user_id');
            const response = await axios.patch(
                `http://localhost:5000/api/change-password/${userId}`,
                {
                    current_password: passwordData.currentPassword,
                    new_password: passwordData.newPassword,
                    email: passwordData.email
                },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.status === 200) {
                setMessage({ type: 'success', text: 'Password updated successfully!' });
                setPasswordData(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }));
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    setMessage({ type: 'error', text: error.response.data.error || 'Authentication failed!' });
                } else {
                    setMessage({ type: 'error', text: error.response.data.error || 'Failed to update password' });
                }
            } else {
                setMessage({ type: 'error', text: 'Failed to update password. Please try again.' });
            }
            console.error('Error updating password:', error);
        }
    };

    return (
        <div className='container mt-5'>
            <div className='row'>
                <aside className="col-md-2">
                    <Sidebar />
                </aside>
                <section className="col-md-9">
                    <div className='card'>
                        <h5 className='card-header'>Change Password</h5>
                        <div className='card-body'>
                            {message.text && (
                                <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`}>
                                    {message.text}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3 row">
                                    <label htmlFor="email" className="col-sm-3 col-form-label">Email</label>
                                    <div className="col-sm-9">
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={passwordData.email}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label htmlFor="currentPassword" className="col-sm-3 col-form-label">Current Password</label>
                                    <div className="col-sm-9">
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="currentPassword"
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label htmlFor="newPassword" className="col-sm-3 col-form-label">New Password</label>
                                    <div className="col-sm-9">
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="newPassword"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label htmlFor="confirmPassword" className="col-sm-3 col-form-label">Confirm Password</label>
                                    <div className="col-sm-9">
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <hr />
                                <button type="submit" className='btn btn-primary'>Update Password</button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ChangePassword;
