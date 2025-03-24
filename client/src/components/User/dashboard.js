import {Link} from 'react-router-dom';
import Sidebar from './sidebar';

function Dashboard(){
    return(
        <div className='container  mt-4'>
            <div className='row'>
                <aside className="col-md-2">
                    <Sidebar/>
                </aside>
                <section className="col-md-9">
                    <h5 className='bold' style={{ color: 'dark' }}> Student Dashboard</h5>
                </section>
            </div>
        </div>
    )

}

export default Dashboard;
