import {Link} from 'react-router-dom';
function Header() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
        <div className="container">
            <Link className="navbar-brand" to="/">Learn Online</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to='/about'>About Us</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/all-units">Units</Link>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Teacher
                        </a>
                        <ul className="dropdown-menu">
                            <li><Link className="dropdown-item" to="/teacher-login">LogIn</Link></li>
                            <li><Link className="dropdown-item" to="/teacher-register">Register</Link></li>
                            <li><hr className="dropdown-divider"/></li>
                            <li><Link className="dropdown-item" to="/teacher-dashboard">Dashboard</Link></li>
                            <li><Link className="dropdown-item" to="/teacher-logout">LogOut</Link></li>
                        </ul>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/finance">Finance</Link>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            User
                        </a>
                        <ul className="dropdown-menu">
                            <li><Link className="dropdown-item" to="/user-login">LogIn</Link></li>
                            <li><Link className="dropdown-item" to="/user-register">Register</Link></li>
                            <li><hr className="dropdown-divider"/></li>
                            <li><Link className="dropdown-item" to="/user-dashboard">Dashboard</Link></li>
                            <li><Link className="dropdown-item" to="/user-logout">LogOut</Link></li>
                        </ul>
                    </li>
                    
                </ul>
                <form className="d-flex mt-3 mt-lg-0">
                    <input
                        className="form-control me-2"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                    />
                    <button className="btn btn-outline-light" type="submit">
                        Search
                    </button>
                </form>
            </div>
        </div>
    </nav>
    );
  }
  
  export default Header;
  