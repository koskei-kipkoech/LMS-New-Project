import { useState } from 'react';
import axios from 'axios';

function TeacherRegister(){
    const [teacherData, setTeacherData] = useState({
        username: '',
        email: '',
        password: '',
        qualifications: '',
        bio: ''
    });

    const handleChange = (event) => {
        setTeacherData({
            ...teacherData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/teacher/register', teacherData);
            if (response.status === 201) {
                alert('Registration successful!');
                window.location.href = '/teacher/login';
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert('Email already exists!');
            } else {
                alert('Registration failed. Please try again.');
            }
            console.error('Registration error:', error);
        }
    };

    return(
        <div className='container mt-5'>
            <div className='row'>
                <div className='col-8 offset-2'>
                    <div className="card">
                        <h4 className='card-header'>Teacher Register</h4>
                        <div className='card-body'>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <input type="text" name="username" className="form-control" onChange={handleChange} required/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input type="email" name="email" className="form-control" onChange={handleChange} required/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input type="password" name="password" className="form-control" onChange={handleChange} required/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="qualifications" className="form-label">Qualifications</label>
                                    <input type="text" name="qualifications" className="form-control" onChange={handleChange} required/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="bio" className="form-label">Bio</label>
                                    <textarea name="bio" className="form-control" onChange={handleChange} required></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary">Register</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeacherRegister;