import {Link} from 'react-router-dom';
import TeacherSidebar from './sidebar';

function MyResults(){
    return(
        <div className='container  mt-4'>
            <div className='row'>
                <aside className="col-md-2">
                    <TeacherSidebar/>
                </aside>
                <section className="col-md-10">
                    <div className='card'>
                        <h5 className='class-header'>  My Results </h5>
                        <div className='card-body'>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th> Unit</th>
                                        <th>Assignment /10</th>
                                        <th>CAT /20</th>
                                        <th>End Month Exams /70</th>
                                        <th>Total in % </th>

                                    </tr>
                                </thead>
                                <tbody>
                                    <td><Link to='/'>Introduction 1</Link></td>
                                    <td>6</td>
                                    <td>16</td>
                                    <td>52</td>
                                    <td>73</td>
                                </tbody>
                                <tbody>
                                    <td><Link to='/'>Agriculture </Link></td>
                                    <td>4</td>
                                    <td>12</td>
                                    <td>60</td>
                                    <td>76</td>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )

}

export default MyResults;