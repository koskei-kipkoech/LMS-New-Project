import {Link} from 'react-router-dom';

function PopularUnits(){
    return(
        <div className="container mt-5">
        {/*Popular Unit*/}
        <h3 className="pb-1 mb-4 mt-5"> Popular Units <a href="/" className="float-end">See All</a></h3>
            <div className="row">  
                <div className="col-md-3 mb-3">
                    <div className="card">
                        <Link to="/detail/1"><img src="background.png" className="card-img-top" alt="..." /></Link>
                        <div className="card-body">
                            <h5 className="card-title"> <Link to="/detail/1">Unit Title</Link></h5>
                        </div>
                        <div className='card-footer'>
                            <div className='title'>
                                <span>Rating: 4.7/5</span>
                                <span className='float-end'>Views: 167</span>  
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card">
                        <img src="background.png" className="card-img-top" alt="..."/>
                        <div className="card-body">
                            <h5 className="card-title"> <a href ="/">Unit Title</a></h5>
                        </div>
                        <div className='card-footer'>
                            <div className='title'>
                                <span>Rating: 4.5/5</span>
                                <span className='float-end'>Views: 157</span>  
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card">
                        <img src="background.png" className="card-img-top" alt="..."/>
                        <div className="card-body">
                            <h5 className="card-title"> <a href ="/">Unit Title</a></h5>
                        </div>
                        <div className='card-footer'>
                            <div className='title'>
                                <span>Rating: 4.3/5</span>
                                <span className='float-end'>Views: 137</span>  
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card">
                        <Link to="/detail/1"><img src="background.png" className="card-img-top" alt="..." /></Link>
                        <div className="card-body">
                            <h5 className="card-title"> <Link to="/detail/1">Unit Title</Link></h5>
                        </div>
                        <div className='card-footer'>
                            <div className='title'>
                                <span>Rating: 4.2/5</span>
                                <span className='float-end'>Views: 133</span>  
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card">
                        <Link to="/detail/1"><img src="background.png" className="card-img-top" alt="..." /></Link>
                        <div className="card-body">
                            <h5 className="card-title"> <Link to="/detail/1">Unit Title</Link></h5>
                        </div>
                        <div className='card-footer'>
                            <div className='title'>
                                <span>Rating: 4.1/5</span>
                                <span className='float-end'>Views: 120</span>  
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card">
                        <Link to="/detail/1"><img src="background.png" className="card-img-top" alt="..." /></Link>
                        <div className="card-body">
                            <h5 className="card-title"> <Link to="/detail/1">Unit Title</Link></h5>
                        </div>
                        <div className='card-footer'>
                            <div className='title'>
                                <span>Rating: 3.7/5</span>
                                <span className='float-end'>Views: 110</span>  
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card">
                        <Link to="/detail/1"><img src="background.png" className="card-img-top" alt="..." /></Link>
                        <div className="card-body">
                            <h5 className="card-title"> <Link to="/detail/1">Unit Title</Link></h5>
                        </div>
                        <div className='card-footer'>
                            <div className='title'>
                                <span>Rating: 3.5/5</span>
                                <span className='float-end'>Views: 96</span>  
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card">
                        <Link to="/detail/1"><img src="background.png" className="card-img-top" alt="..." /></Link>
                        <div className="card-body">
                            <h5 className="card-title"> <Link to="/detail/1">Unit Title</Link></h5>
                        </div>
                        <div className='card-footer'>
                            <div className='title'>
                                <span>Rating: 3.4/5</span>
                                <span className='float-end'>Views: 88</span>  
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*End Popular Unit*/}
            {/*Pagination Start*/}
            <nav aria-label="Page navigation example mt-5">
                <ul className="pagination justify-content-center">
                    <li className="page-item"><a className="page-link" href="/">Previous</a></li>
                    <li className="page-item"><a className="page-link" href="/">1</a></li>
                    <li className="page-item"><a className="page-link" href="/">2</a></li>
                    <li className="page-item"><a className="page-link" href="/">3</a></li>
                    <li className="page-item"><a className="page-link" href="/">Next</a></li>
                </ul>
            </nav>
            {/*End  Pagination*/}
        </div>
    );
}
export default PopularUnits; 