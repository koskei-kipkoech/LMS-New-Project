import {Link} from 'react-router-dom';
import TeacherSidebar from './sidebar';

function MyUsers(){
    return(
        <div className='container  mt-4'>
            <div className='row'>
                <aside className="col-md-2">
                    <TeacherSidebar/>
                </aside>
                <section className="col-md-9">
                    <div className='card'>
                        <h5 className='class-header'> My Users</h5>
                        <div className='card-body'>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th>Studdent Name</th>
                                        <th>Enrolled Unit</th>
                                        <th>UserName</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <td>Patrick kipkoech</td>
                                    <td><Link to='/'>Introduction 1</Link></td>
                                    <td>Patkipp123</td>
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

export default MyUsers;