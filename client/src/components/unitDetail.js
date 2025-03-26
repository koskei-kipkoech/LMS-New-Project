import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import EnrollButton from './EnrollButton';

function UnitDetail() {
  const { unit_id } = useParams();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnitDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/units/${unit_id}`, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
        setUnit(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch unit details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchUnitDetail();
  }, [unit_id]);

  const getYouTubeId = (url) => {
    const match = url.match(/[?&]v=([^&]+)/) || url.match(/youtu.be\/([^?]+)/);
    return match ? match[1] : null;
  };


  return (
    <div className="container mt-4">
      {/* Container for unit details */}
      {loading && (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {unit && (
        <div>
          <div className="row">
            <div className="col-4">
              <img src="/student.png" className="img-thumbnail" alt={unit.title}/>
            </div>
            <div className="col-8">
              <h3>{unit.title}</h3>
              <p className='font-monospace'>{unit.description}</p>
              <p className='fw-bold'>Unit By: <Link to={`/teacher-detail/${unit.teacher.id}`}>{unit.teacher.name}</Link></p>
{unit.is_enrolled ? (
  <p className="fw-bold">You are enrolled in this unit.</p>
) : (
  <EnrollButton unitId={unit_id} />
)}
              {unit.start_date && unit.end_date && (
                  <p className='fw-bold'>Duration: {new Date(unit.end_date).getTime() - new Date(unit.start_date).getTime()} ms</p>
              )}
              <p className='fw-bold'>Total Enrolled: {unit.total_enrolled} Students</p>
              <p className='fw-bold'>Ratings: {unit.average_rating}/5 ({unit.rating_count} reviews)</p>
            </div>
          </div>

          {/* Unit Video */}
          <div className="card mt-4">
            <div className="card-header">
              <h3 className="fw-bold">Unit Video</h3>
            </div>
            <div className="card-body">
              {unit.video_url ? (
                <>
                  <div className="ratio ratio-16x9 mb-3">
                    <button
                      className="btn btn-link p-0 border-0"
                      data-bs-toggle="modal"
                      data-bs-target="#videoModal"
                    >
                      <img
                        src={`https://img.youtube.com/vi/${getYouTubeId(unit.video_url)}/hqdefault.jpg`}
                        className="img-fluid rounded"
                        alt="Video thumbnail"
                      />
                      <div className="position-absolute top-50 start-50 translate-middle">
                        <i className="bi bi-play-circle-fill" style={{ fontSize: '4rem', color: 'rgba(255,255,255,0.7)' }}></i>
                      </div>
                    </button>
                  </div>

                  {/* Video Modal */}
                  <div className="modal fade" id="videoModal" tabIndex="-1" aria-labelledby="videoModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">{unit.title} Video</h5>
                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                          <div className="ratio ratio-16x9">
                            <iframe
                              src={`https://www.youtube.com/embed/${getYouTubeId(unit.video_url)}`}
                              title="YouTube video player"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="alert alert-warning">No video available for this unit</div>
              )}
            </div>
          </div>

          {/* Related Units */}
          {unit.related_units && unit.related_units.length > 0 && (
            <div className="card mt-4">
              <div className="card-header">
                <h3 className="fw-bold">Related Units</h3>
              </div>
              <div className="card-body">
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                  {unit.related_units.map(relatedUnit => (
                    <div key={relatedUnit.id} className="col">
                      <div className="card h-100">
                        <img src="/student.png" className="card-img-top" alt={relatedUnit.title} />
                        <div className="card-body">
                          <h5 className="card-title">{relatedUnit.title}</h5>
                          <p className="card-text text-truncate">{relatedUnit.description}</p>
                          <p className="card-text">
                            <small className="text-muted">
                              By: {relatedUnit.teacher.name}
                            </small>
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="text-muted small">
                              <i className="bi bi-star-fill text-warning"></i> {relatedUnit.average_rating || 'N/A'}
                              <span className="ms-2">
                                <i className="bi bi-people-fill"></i> {relatedUnit.total_enrolled}
                              </span>
                            </div>
                            <Link to={`/unit/${relatedUnit.id}`} className="btn btn-outline-primary btn-sm">
                              View Unit
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UnitDetail;