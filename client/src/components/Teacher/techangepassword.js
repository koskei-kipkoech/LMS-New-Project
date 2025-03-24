import {Link} from 'react-router-dom';
import Sidebar from './sidebar';

function  TeacherChangePassword(){
    return(
        <div className='container  mt-5'>
            <div className='row'>
                <aside className="col-md-2">
                    <Sidebar/>
                </aside>
                <section className="col-md-9">
                    <div className='card'>
                        <h5 className='card-header'>Change Password</h5>
                        <div className='card-body'>
                            <div class="mb-3 row">
                                <label for="staticEmail" class="col-sm-2 col-form-label">Email</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="staticEmail"/>
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label for="inputPassword" className="col-sm-2 col-form-label"> New Password</label>
                                <div className="col-sm-10">
                                    <input type="password" className="form-control" id="inputPassword"/>
                                </div>     
                            </div>
                            <hr/>
                            <button className='btn btn-success'>  Update </button> 
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )

}

export default TeacherChangePassword;
