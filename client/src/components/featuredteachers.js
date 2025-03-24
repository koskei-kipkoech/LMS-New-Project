import {Link} from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const baseUrl='http://127.0.0.1:8000/admin/main/';
function FeatuedTeachers(){
    const [teacher,setTeacher]=useState(null);
    useEffect(()=>{
        axios.get(baseUrl+'/teacher/').then((response)=>{
            setTeacher(response.data);
        }); 
    },[]);
    console.log(teacher);
    return(
        <div className="container mt-5">
            {/*Featured  Teachers*/}
            <h3 className="pb-1 mb-4 mt-5">Featured Teachers <a href="/" className="float-end">See All</a></h3>
            <div className="row">
                <div className="col-md-4">
                    <div className="card">
                        <img src="teacher.png" className="card-img-top" alt="..."/>
                        <div className="card-body">
                            <h5 className="card-title"> <Link to ="/teacher-detail/1">Teacher Name</Link></h5>
                        </div>
                        <div className='card-footer'>
                            <div className='title'>
                                <span className='fw-bold'>Views: 207</span>  
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <img src="teacher.png" className="card-img-top" alt="..."/>
                        <div className="card-body">
                            <h5 className="card-title"> <Link to ="/teacher-detail/1">Teacher Name</Link></h5>
                        </div>
                        <div className='card-footer'>
                            <div className='title'>
                                <span className='fw-bold'>Views: 176</span>  
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <img src="teacher.png" className="card-img-top" alt="..."/>
                        <div className="card-body">
                            <h5 className="card-title"> <Link to ="/teacher-detail/1">Teacher Name</Link></h5>
                        </div>
                        <div className='card-footer'>
                            <div className='title'>
                                <span className='fw-bold'>Views: 165</span>  
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <img src="teacher.png" className="card-img-top" alt="..."/>
                        <div className="card-body">
                            <h5 className="card-title"> <Link to ="/teacher-detail/1">Teacher Name</Link></h5>
                        </div>
                        <div className='card-footer'>
                            <div className='title'>
                                <span className='fw-bold'>Views: 155</span>  
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <img src="teacher.png" className="card-img-top" alt="..."/>
                        <div className="card-body">
                            <h5 className="card-title"> <Link to ="/teacher-detail/1">Teacher Name</Link></h5>
                        </div>
                        <div className='card-footer'>
                            <div className='title'>
                                <span className='fw-bold'>Views: 146</span>  
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <img src="teacher.png" className="card-img-top" alt="..."/>
                        <div className="card-body">
                            <h5 className="card-title"> <Link to ="/teacher-detail/1">Teacher Name</Link></h5>
                        </div>
                        <div className='card-footer'>
                            <div className='title'>
                                <span className='fw-bold'>Views: 140</span>  
                            </div>
                        </div>
                    </div>
                </div>
            </div>
             {/*End Featured  Teachers*/}
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
export default FeatuedTeachers; 