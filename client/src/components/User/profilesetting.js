import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './sidebar';

function ProfileSetting() {
    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '',
        interests: '',
        theme: 'light',
        notifications_enabled: true,
        language: 'en'
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isNewProfile, setIsNewProfile] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const userId = localStorage.getItem('user_id');
                const token = localStorage.getItem('token');

                if (!userId || !token) {
                    throw new Error('No user ID or token found');
                }

                const response = await axios.get(`http://localhost:5000/api/profile/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setProfileData(response.data);
                setIsNewProfile(false);
                setIsLoading(false);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    // If profile doesn't exist, prepare for profile creation
                    setIsNewProfile(true);
                    // Pre-fill email from user data if possible
                    setProfileData(prev => ({
                        ...prev,
                        email: localStorage.getItem('user_email') || ''
                    }));
                } else {
                    setMessage({ 
                        type: 'error', 
                        text: 'Error loading profile data: ' + (error.response?.data?.message || error.message) 
                    });
                }
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setProfileData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const userId = localStorage.getItem('user_id');
            const token = localStorage.getItem('token');

            const method = isNewProfile ? 'post' : 'put';
            const endpoint = `http://localhost:5000/api/profile/${userId}`;

            const response = await axios[method](endpoint, profileData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Update localStorage with latest profile info
            localStorage.setItem('user_email', response.data.profile.email);

            setMessage({ 
                type: 'success', 
                text: isNewProfile ? 'Profile created successfully!' : 'Profile updated successfully!'
            });
            setIsNewProfile(false);
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: isNewProfile 
                    ? 'Failed to create profile: ' + (error.response?.data?.error || error.message)
                    : 'Failed to update profile: ' + (error.response?.data?.error || error.message)
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='container mt-5'>
            <div className='row'>
                <aside className="col-md-2">
                    <Sidebar />
                </aside>
                <section className="col-md-10">
                    <div className='card'>
                        <h5 className='card-header'>
                            {isNewProfile ? 'Complete Your Profile' : 'Profile Settings'}
                        </h5>
                        <div className='card-body'>
                            {message.text && (
                                <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`}>
                                    {message.text}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3 row">
                                    <label htmlFor="fullName" className="col-sm-2 col-form-label">Full Name</label>
                                    <div className="col-sm-10">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="fullName"
                                            name="fullName"
                                            value={profileData.fullName}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label htmlFor="email" className="col-sm-2 col-form-label">Email</label>
                                    <div className="col-sm-10">
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleChange}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label htmlFor="interests" className="col-sm-2 col-form-label">Interests</label>
                                    <div className="col-sm-10">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="interests"
                                            name="interests"
                                            value={profileData.interests}
                                            onChange={handleChange}
                                            placeholder="Enter your interests"
                                        />
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label htmlFor="theme" className="col-sm-2 col-form-label">Theme</label>
                                    <div className="col-sm-10">
                                        <select
                                            className="form-control"
                                            id="theme"
                                            name="theme"
                                            value={profileData.theme}
                                            onChange={handleChange}
                                        >
                                            <option value="light">Light</option>
                                            <option value="dark">Dark</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label htmlFor="language" className="col-sm-2 col-form-label">Language</label>
                                    <div className="col-sm-10">
                                        <select
                                            className="form-control"
                                            id="language"
                                            name="language"
                                            value={profileData.language}
                                            onChange={handleChange}
                                        >
                                            <option value="en">English</option>
                                            <option value="es">Spanish</option>
                                            <option value="fr">French</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <div className="col-sm-10 offset-sm-2">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="notifications_enabled"
                                                name="notifications_enabled"
                                                checked={profileData.notifications_enabled}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label" htmlFor="notifications_enabled">
                                                Enable Notifications
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <button 
                                    type="submit" 
                                    className='btn btn-primary'
                                    disabled={isLoading}
                                >
                                    {isNewProfile ? 'Create Profile' : 'Update Profile'}
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ProfileSetting;