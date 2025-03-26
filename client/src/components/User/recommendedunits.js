import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './sidebar';

function RecommendedUnits() {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/units/recommended');
                setUnits(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to load recommended units');
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
                        <div className='card-header d-flex justify-content-between align-items-center'>
                            <h5 className='mb-0'>Recommended Units</h5>
                            <Link to='/units' className='btn btn-primary btn-sm'>View All Units</Link>
                        </div>
                        <div className='card-body'>
                            {error ? (
                                <div className="alert alert-danger">{error}</div>
                            ) : units.length === 0 ? (
                                <p className="text-muted">No recommended units available.</p>
                            ) : (
                                <div className="row row-cols-1 row-cols-md-3 g-4">
                                    {units.map(unit => (
                                        <div key={unit.id} className="col">
                                            <div className="card h-100">
                                                <div className="card-body">
                                                    <h5 className="card-title">{unit.title}</h5>
                                                    <p className="card-text">{unit.description}</p>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <small className="text-muted">Rating: {unit.average_rating.toFixed(1)}/5</small>
                                                        <Link to={`/unit/${unit.id}`} className="btn btn-outline-primary btn-sm">View Details</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default RecommendedUnits;