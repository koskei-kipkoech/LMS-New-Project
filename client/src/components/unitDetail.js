import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

function UnitDetail() {
  const { unit_id } = useParams();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnitDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/units/${unit_id}`);
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
              {unit.start_date && unit.end_date && (
                  <p className='fw-bold'>Duration: {new Date(unit.end_date).getTime() - new Date(unit.start_date).getTime()} ms</p>
              )}
              <p className='fw-bold'>Total Enrolled: {unit.total_enrolled} Students</p>
              <p className='fw-bold'>Ratings: {unit.average_rating}/5 ({unit.rating_count} reviews)</p>
            </div>
          </div>

          {/* Unit Videos */}
          <div className="card mt-4">
            <div className="card-header">
              <h3><span className="fw-bold">Unit Videos</span></h3>
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item">
                    <span className="fw-bold">Introduction Unit</span>
                    <button className="btn btn-sm btn-danger float-end" data-bs-toggle="modal" data-bs-target="#videoModal1">
                        <i className="bi bi-youtube" style={{ fontSize: '2rem', color: 'cornflowerblue' }}></i>
                    </button>
                    {/*Videos Model Start*/}
                    <div className="modal fade" id="videoModal1" tabIndex="-1" aria-labelledby="videoModalLabel1" aria-hidden="true">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="videoModalLabel1">Introduction Video</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="ratio ratio-16x9">
                                        <iframe src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0" title="YouTube video" allowFullScreen></iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*End Videos Model*/}
                </li>
                <li className="list-group-item">
                    <span className="fw-bold">Topic 1 </span>
                    <button className="btn btn-sm btn-danger float-end" data-bs-toggle="modal" data-bs-target="#videoModal2">
                        <i className="bi bi-youtube" style={{ fontSize: '2rem', color: 'cornflowerblue' }}></i>
                    </button>
                    {/*Videos Model Start*/}
                    <div className="modal fade" id="videoModal2" tabIndex="-1" aria-labelledby="videoModalLabel2" aria-hidden="true">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="videoModalLabel2">Topic 1 Video</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="ratio ratio-16x9">
                                        <iframe src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0" title="YouTube video" allowFullScreen></iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*End Videos Model*/}
                </li>
                <li className="list-group-item">
                    <span className="fw-bold">Topic 2 </span>
                    <button className="btn btn-sm btn-danger float-end" data-bs-toggle="modal" data-bs-target="#videoModal3">
                        <i className="bi bi-youtube" style={{ fontSize: '2rem', color: 'cornflowerblue' }}></i>
                    </button>
                    {/*Videos Model Start*/}
                    <div className="modal fade" id="videoModal3" tabIndex="-1" aria-labelledby="videoModalLabel3" aria-hidden="true">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="videoModalLabel3">Topic 2 Video</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="ratio ratio-16x9">
                                        <iframe src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0" title="YouTube video" allowFullScreen></iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*End Videos Model*/}
                </li>
                <li className="list-group-item">
                    <span className="fw-bold">Topic 3 </span>
                    <button className="btn btn-sm btn-danger float-end" data-bs-toggle="modal" data-bs-target="#videoModal4">
                        <i className="bi bi-youtube" style={{ fontSize: '2rem', color: 'cornflowerblue' }}></i>
                    </button>
                    {/*Videos Model Start*/}
                    <div className="modal fade" id="videoModal4" tabIndex="-1" aria-labelledby="videoModalLabel4" aria-hidden="true">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="videoModalLabel4">Topic 3 Video</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="ratio ratio-16x9">
                                        <iframe src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0" title="YouTube video" allowFullScreen></iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*End Videos Model*/}
                </li>
                <li className="list-group-item">
                    <span className="fw-bold">Topic 4</span>
                    <button className="btn btn-sm btn-danger float-end" data-bs-toggle="modal" data-bs-target="#videoModal5">
                        <i className="bi bi-youtube" style={{ fontSize: '2rem', color: 'cornflowerblue' }}></i>
                    </button>
                    {/*Videos Model Start*/}
                    <div className="modal fade" id="videoModal5" tabIndex="-1" aria-labelledby="videoModalLabel5" aria-hidden="true">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="videoModalLabel5">Topic 4 Video</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="ratio ratio-16x9">
                                        <iframe src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0" title="YouTube video" allowFullScreen></iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*End Videos Model*/}
                </li>
                <li className="list-group-item">
                    <span className="fw-bold">Topic 5 </span>
                    <button className="btn btn-sm btn-danger float-end" data-bs-toggle="modal" data-bs-target="#videoModal6">
                        <i className="bi bi-youtube" style={{ fontSize: '2rem', color: 'cornflowerblue' }}></i>
                    </button>
                    {/*Videos Model Start*/}
                    <div className="modal fade" id="videoModal6" tabIndex="-1" aria-labelledby="videoModalLabel6" aria-hidden="true">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="videoModalLabel6">Topic 5 Video</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="ratio ratio-16x9">
                                        <iframe src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0" title="YouTube video" allowFullScreen></iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*End Videos Model*/}
                </li>
            </ul>
          </div>

          <h3 className="pb-1 mb-4 mt-5"> Related Units </h3>
          <div className="row">
            <div className="col-md-4">
                <div className="card">
                    <img src="/student.png" className="card-img-top" alt="..." />
                    <div className="card-body">
                         <h5 className="card-title"> <Link to="/detail/1">Unit Title</Link></h5>
                    </div>
                </div>
            </div>
            <div className="col-md-4 ">
                 <div className="card">
                    <img src="/student.png" className="card-img-top" alt="..."/>
                    <div className="card-body">
                        <h5 className="card-title"> <a href ="/">Unit Title</a></h5>
                    </div>
                </div>
            </div> 
          </div>    
        </div>
      )}
    </div>
  );
}

export default UnitDetail;