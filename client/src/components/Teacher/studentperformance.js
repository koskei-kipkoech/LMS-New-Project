import {Link} from 'react-router-dom';
import TeacherSidebar from './sidebar';

function StudentPerformance(){
    return(
        <div className='container  mt-4'>
            <div className='row'>
                <aside className="col-md-2">
                    <TeacherSidebar/>
                </aside>
                <section className="col-md-10">
                    <div className='card'>
                        <h5 className='class-header'>  Student Performance </h5>
                        <div className='card-body'>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th>Studdent Name</th>
                                        <th> Unit</th>
                                        <th>Assignment /10</th>
                                        <th>CAT /20</th>
                                        <th>End Month Exams /70</th>
                                        <th>Total in % </th>
                                        <th>Action</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    <td>Patrick kipkoech</td>
                                    <td><Link to='/'>Introduction 1</Link></td>
                                    <td>6</td>
                                    <td>16</td>
                                    <td>52</td>
                                    <td>73</td>
                                    <td><button className='btn btn-danger btn-sm danger active'>Delete</button></td>
                                </tbody>
                                <tbody>
                                    <td>Patrick kipkoech</td>
                                    <td><Link to='/'>Agriculture </Link></td>
                                    <td>4</td>
                                    <td>12</td>
                                    <td>60</td>
                                    <td>76</td>
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

export default StudentPerformance;