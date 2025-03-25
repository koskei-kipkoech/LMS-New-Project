import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './sidebar';
import axios from 'axios';

function MyUnits() {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const studentId = localStorage.getItem('user_id');
        const fetchUnits = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/student/units/${studentId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        params: {
                            page: currentPage
                        }
                    }
                );
                setUnits(response.data.units);
                setTotalPages(response.data.pages);
                setError(null);
            } catch (error) {
                setError('Failed to fetch units. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchUnits();
    }, [currentPage]);

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
            alert('Failed to unenroll from the unit. Please try again.');
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
                                                            <div className="progress" style={{ height: '20px' }}>
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

                                    {totalPages > 1 && (
                                        <nav className="mt-4">
                                            <ul className="pagination justify-content-center">
                                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                    <button
                                                        className="page-link"
                                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                                        disabled={currentPage === 1}
                                                    >
                                                        Previous
                                                    </button>
                                                </li>
                                                {[...Array(totalPages)].map((_, index) => (
                                                    <li
                                                        key={index}
                                                        className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                                                    >
                                                        <button
                                                            className="page-link"
                                                            onClick={() => setCurrentPage(index + 1)}
                                                        >
                                                            {index + 1}
                                                        </button>
                                                    </li>
                                                ))}
                                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                    <button
                                                        className="page-link"
                                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                                        disabled={currentPage === totalPages}
                                                    >
                                                        Next
                                                    </button>
                                                </li>
                                            </ul>
                                        </nav>
                                    )}
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