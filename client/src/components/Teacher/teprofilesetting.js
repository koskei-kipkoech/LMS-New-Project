import {Link} from 'react-router-dom';
import TeacherSidebar from './sidebar';

function TeacherProfileSetting(){
    return(
        <div className='container  mt-5'>
            <div className='row'>
                <aside className="col-md-2">
                    <TeacherSidebar/>
                </aside>
                <section className="col-md-9">
                    <div className='card'>
                        <h5 className='card-header'>Profile Settings</h5>
                        <div className='card-body'>
                        <div class="mb-3 row">
                                <label for="staticEmail" class="col-sm-2 col-form-label">Full Name</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="staticEmail"/>
                                </div>
                            </div>
                            <div class="mb-3 row">
                                <label for="staticEmail" class="col-sm-2 col-form-label">Email</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="staticEmail"/>
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label for="inputPassword" className="col-sm-2 col-form-label">Profile Photo</label>
                                <div className="col-sm-10">
                                    <input type="file" className="form-control" id="inputPassword"/>
                                </div>     
                            </div>
                            <div className="mb-3 row">
                                <label for="inputPassword" className="col-sm-2 col-form-label"> Skills</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="inputPassword"/>
                                </div>     
                            </div>
                            <div className="mb-3 row">
                                <label for="inputPassword" className="col-sm-2 col-form-label">Password</label>
                                <div className="col-sm-10">
                                    <input type="password" className="form-control" id="inputPassword"/>
                                </div>     
                            </div>
                            <hr/>
                            <button className='btn btn-primary'> Update </button> 
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )

}

export default TeacherProfileSetting;
