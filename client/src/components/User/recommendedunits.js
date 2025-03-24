import {Link} from 'react-router-dom';
import Sidebar from './sidebar';

function RecommendedUnits(){
    return(
        <div className='container  mt-4'>
            <div className='row'>
                <aside className="col-md-2">
                    <Sidebar/>
                </aside>
                <section className="col-md-9">
                    <div className='card'>
                        <h5 className='class-header'> Recommended Units</h5>
                        <div className='card-body'>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Created By</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <td>Introduction</td>
                                    <td><Link to='/'>Madam Vancy</Link></td>
                                    <td><button className='btn btn-danger btn-sm danger active'>Delete</button></td>
                                </tbody>
                                <tbody>
                                    <td>User stories </td>
                                    <td><Link to='/'>Mr Sim</Link></td>
                                    <td><button className='btn btn-danger btn-sm danger active'>Delete</button></td>
                                </tbody>
                                <tbody>
                                    <td>Upcoming stories </td>
                                    <td><Link to='/'>Mr Sim</Link></td>
                                    <td><button className='btn btn-danger btn-sm danger active'>Delete</button></td>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )

}

export default RecommendedUnits;