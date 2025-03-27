import {Link} from 'react-router-dom';

function Sidebar(){
    return(
        <div className='card'>
            <h5 className='card-header'>Dashboard</h5>
            <div className='list-group list-group-flush'>
                <Link to='/my-units' className='list-group-item list-group-item-action'>My Units</Link>
                <Link to='/recommended-units' className='list-group-item list-group-item-action'>Recommended Units </Link>
                <Link to='/favourite-units' className='list-group-item list-group-item-action'>Favourite Units </Link>
                <Link to='/my-results' className='list-group-item list-group-item-action'>My Results </Link>
                <Link to='/my-assignment' className='list-group-item list-group-item-action'>My Assignment </Link>
                <Link to='/my-performance' className='list-group-item list-group-item-action'>My Performance Trend </Link>
                <Link to='/profile-setting' className='list-group-item list-group-item-action'>Profile Settings </Link>
                <Link to='/change-password' className='list-group-item list-group-item-action text-dark'>Change Password </Link>
                <Link to='/user-login' className='list-group-item list-group-item-action text-danger'>Logout </Link>
            </div>
        </div>
    )
}
export default Sidebar;