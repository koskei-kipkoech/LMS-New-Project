import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './sidebar';

function FavouriteUnits() {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/units/progress', {
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
                    <Sidebar/>
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
                    <Sidebar/>
                </aside>
                <section className="col-md-9">
                    <div className='card'>
                        <h5 className='card-header'>Units In Progress ({'>'}30%)</h5>
                        <div className='card-body'>
                            {error && <div className="alert alert-danger">{error}</div>}
                            {units.length === 0 ? (
                                <p className="text-muted">No units with progress greater than 30% found.</p>
                            ) : (
                                <table className='table table-bordered'>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Created By</th>
                                            <th>Progress</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {units.map(unit => (
                                            <tr key={unit.id}>
                                                <td><Link to={`/unit/${unit.id}`}>{unit.title}</Link></td>
                                                <td>{unit.teacher}</td>
                                                <td>{unit.progress}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )

}

export default FavouriteUnits;