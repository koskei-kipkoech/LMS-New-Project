import { useState } from 'react';
import axios from 'axios';

function Login(){
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (event) => {
        setLoginData({
            ...loginData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!loginData.email || !loginData.password) {
            alert('Please fill in all fields');
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/api/login', loginData);
            if (response.data && response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('user_id', response.data.user_id);
                localStorage.setItem('role', response.data.role);
                window.location.href = '/user-dashboard';
            } else {
                alert('Invalid response from server');
            }
        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        alert('Invalid email or password');
                        break;
                    case 404:
                        alert('User not found');
                        break;
                    default:
                        alert('Login failed. Please try again later.');
                }
            } else if (error.request) {
                alert('Network error. Please check your connection.');
            } else {
                alert('An unexpected error occurred.');
            }
            console.error('Login error:', error);
        }
    };

    return(
        <div className='container mt-5'>
            <div className='row'>
                <div className='col-8 offset-2'>
                    <div className="card">
                        <h4 className='card-header'>User Login</h4>
                        <div className='card-body'>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input type="email" name="email" className="form-control" onChange={handleChange} required/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input type="password" name="password" className="form-control" onChange={handleChange} required/>
                                </div>
                                <button type="submit" className="btn btn-primary">Login</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;