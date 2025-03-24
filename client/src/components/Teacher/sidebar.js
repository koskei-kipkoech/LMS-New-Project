import {Link} from 'react-router-dom';

function TeacherSidebar(){
    return(
        <div className='card'>
            <h5 className='card-header'> TDashboard</h5>
            <div className='list-group list-group-flush'>
                <Link to='/te-units' className='list-group-item list-group-item-action'>My Units</Link>
                <Link to='/my-users' className='list-group-item list-group-item-action'>My Users</Link>
                <Link to='/add-units' className='list-group-item list-group-item-action'>Add Units </Link>
                <Link to='/student-performance' className='list-group-item list-group-item-action'>Student Performance </Link>
                <Link to='/te-profile-setting' className='list-group-item list-group-item-action'>Profile Setting </Link>
                <Link to='/te-change-password' className='list-group-item list-group-item-action text-dark'>Change Password </Link>
                <Link to='/teacher-login' className='list-group-item list-group-item-action text-danger'>Logout </Link>
            </div>
        </div>
    )
}
export default TeacherSidebar;