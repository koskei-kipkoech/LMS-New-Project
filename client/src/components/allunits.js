import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { unitService } from '../services/apiService';

function AllUnits() {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState('title');

    const navigate = useNavigate();

    const fetchUnits = useCallback(async () => {
        try {
            setLoading(true);
            const response = await unitService.getAllUnits(currentPage, sortBy);
            setUnits(response.data.units);
            setTotalPages(response.data.pages);
            setError(null);
        } catch (err) {
            setError('Failed to fetch units. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [currentPage, sortBy]);

    useEffect(() => {
        fetchUnits();
    }, [currentPage, sortBy, fetchUnits]);

    if (loading) return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
    if (error) return <div className="alert alert-danger mt-5">{error}</div>;

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="mb-0">All Units</h3>
                <select 
                    className="form-select w-auto" 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="title">Sort by Title</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="date">Sort by Date</option>
                </select>
            </div>

            <div className="row">
                {units.map((unit) => (
                    <div key={unit.id} className="col-md-3 mb-4">
                        <div className="card h-100">
                            <Link to={`/detail/${unit.id}`}>
                                <img src="/student.png" className="card-img-top" alt={unit.title} />
                            </Link>
                            <div className="card-body">
                                <h5 className="card-title">
                                    <Link to={`/detail/${unit.id}`} className="text-decoration-none">{unit.title}</Link>
                                </h5>
                                <p className="card-text text-muted">{unit.description?.substring(0, 100)}...</p>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="badge bg-primary">{unit.category}</span>
                                    <div className="text-warning">
                                        <i className="bi bi-star-fill"></i>
                                        <span className="ms-1">{unit.average_rating?.toFixed(1) || 'N/A'}</span>
                                        <small className="text-muted ms-1">({unit.rating_count || 0})</small>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <small className="text-muted">Teacher: {unit.teacher?.name || 'Unknown'}</small>
                                </div>
                                <div className="mt-1">
                                    <small className="text-muted">Students: {unit.total_enrolled || 0}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <nav aria-label="Page navigation" className="mt-4">
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
        </div>
    );
}

export default AllUnits;