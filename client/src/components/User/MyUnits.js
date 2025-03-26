import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './sidebar';
import axios from 'axios';
import UpdateProgress from './UpdateProgress';

function MyUnits() {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    

    useEffect(() => {
        const studentId = parseInt(localStorage.getItem('user_id'), 10);
        const fetchUnits = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/student/units/${studentId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        
                    }
                );
                setUnits(response.data.units);
                
                setError(null);
            } catch (error) {
                if (error.response?.status === 403) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user_id');
                    window.location.href = '/login';
                } else {
                    setError('Failed to fetch units. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchUnits();
    }, []);

    const handleUnenroll = async (unitId) => {
        if (!window.confirm('Are you sure you want to unenroll from this unit?')) return;

        try {
            await axios.delete(
                `http://localhost:5000/api/student/units/${localStorage.getItem('user_id')}/${unitId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setUnits(units.filter(unit => unit.id !== unitId));
        } catch (error) {
            if (error.response?.status === 403) {
                localStorage.removeItem('token');
                localStorage.removeItem('user_id');
                window.location.href = '/login';
            } else {
                alert('Failed to unenroll from the unit. Please try again.');
            }
        }
    };

    if (loading) return (
        <div className='container mt-4'>
            <div className='row'>
                <aside className="col-md-2">
                    <Sidebar />
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
                    <Sidebar />
                </aside>
                <section className="col-md-9">
                    <div className='card'>
                        <div className='card-header'>
                            <h5 className='mb-0'>My Units</h5>
                        </div>
                        <div className='card-body'>
                            {error ? (
                                <div className="alert alert-danger" role="alert">{error}</div>
                            ) : units.length === 0 ? (
                                <p className="text-muted">You haven't enrolled in any units yet.</p>
                            ) : (
                                <>
                                    <div className="table-responsive">
                                        <table className='table table-hover'>
                                            <thead>
                                                <tr>
                                                    <th>Unit Name</th>
                                                    <th>Category</th>
                                                    <th>Teacher</th>
                                                    <th>Progress</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {units.map(unit => (
                                                    <tr key={unit.id}>
                                                        <td>
                                                            <Link to={`/unit/${unit.id}`} className="text-decoration-none">
                                                                {unit.title}
                                                            </Link>
                                                        </td>
                                                        <td>{unit.category}</td>
                                                        <td>{unit.teacher}</td>
                                                        <td>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <div className="progress flex-grow-1" style={{ height: '20px' }}>
                                                                    <div
                                                                        className="progress-bar"
                                                                        role="progressbar"
                                                                        style={{ width: `${unit.progress}%` }}
                                                                        aria-valuenow={unit.progress}
                                                                        aria-valuemin="0"
                                                                        aria-valuemax="100"
                                                                    >
                                                                        {unit.progress}%
                                                                    </div>
                                                                </div>
                                                                <UpdateProgress
                                                                    unitId={unit.id}
                                                                    currentProgress={unit.progress}
                                                                    onProgressUpdate={(newProgress) => {
                                                                        setUnits(units.map(u => 
                                                                            u.id === unit.id ? {...u, progress: newProgress} : u
                                                                        ));
                                                                    }}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <button
                                                                className='btn btn-danger btn-sm'
                                                                onClick={() => handleUnenroll(unit.id)}
                                                            >
                                                                Unenroll
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    
                                </>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default MyUnits;