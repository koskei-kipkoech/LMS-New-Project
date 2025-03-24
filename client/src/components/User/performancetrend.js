import {Link} from 'react-router-dom';
import Sidebar from './sidebar';

function  PerformanceTrend(){
    return(
        <div className='container  mt-5'>
            <div className='row'>
                <aside className="col-md-2">
                    <Sidebar/>
                </aside>
                <section className="col-md-9">
                    <div className='card'>
                        <h5 className='card-header'>Performance Trend </h5>
                        <div className='card-body'>
                        <div className="offcanvas offcanvas-start show text-bg-dark" tabindex="-1" id="offcanvasDark" aria-labelledby="offcanvasDarkLabel">
  <div className="offcanvas-header">
    <h5 className="offcanvas-title" id="offcanvasDarkLabel">Offcanvas</h5>
    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvasDark" aria-label="Close"></button>
  </div>
  <div className="offcanvas-body">
    <p>Place offcanvas content here.</p>
  </div>
</div>   
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )

}

export default PerformanceTrend;
