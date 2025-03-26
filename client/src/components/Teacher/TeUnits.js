import {Link} from 'react-router-dom';
import TeacherSidebar from './sidebar';

import { useState, useEffect } from 'react';
import axios from 'axios';

function TeacherMyUnits() {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/teacher/units', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUnits(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to load units');
                console.error('Error fetching units:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUnits();
    }, []);

    if (loading) return (
        <div className='container mt-4'>
            <div className='row'>
                <aside className="col-md-2">
                    <TeacherSidebar/>
                </aside>
                <section className="col-md-9">
                    <div className="text-center mt-5">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );

    return (
        <div className='container mt-4'>
            <div className='row'>
                <aside className="col-md-2">
                    <TeacherSidebar/>
                </aside>
                <section className="col-md-9">
                    <div className='card'>
                        <h5 className='card-header'>My Units</h5>
                        <div className='card-body'>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th>Unit Title</th>
                                        <th>Category</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {units.map(unit => (
                                        <tr key={unit.id}>
                                            <td><Link to={`/unit/${unit.id}`}>{unit.title}</Link></td>
                                            <td>{unit.category}</td>
                                            <td>
                                                <button className='btn btn-danger btn-sm'>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default TeacherMyUnits;