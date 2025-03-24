// import {Link} from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

function Register(){
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
        interests: '',
        role: 'student'
    });

    const handleChange = (event) => {
        setUserData({
            ...userData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/register', userData);
            if (response.status === 201) {
                alert('Registration successful!');
                // Redirect to login page
                window.location.href = '/login';
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
                        <h4 className='card-header'>User Register</h4>
                        <div className='card-body'>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Full Name</label>
                                    <input type="text" name="name" className="form-control" onChange={handleChange} required/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input type="email" name="email" className="form-control" onChange={handleChange} required/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <input type="text" name="username" className="form-control" onChange={handleChange} required/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input type="password" name="password" className="form-control" onChange={handleChange} required/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="interests" className="form-label">Interests</label>
                                    <textarea name="interests" className='form-control' onChange={handleChange}></textarea>
                                    <div className="form-text">Football, Basketball, Handball, etc.</div>
                                </div>
                                <button type="submit" className="btn btn-primary">Register</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;