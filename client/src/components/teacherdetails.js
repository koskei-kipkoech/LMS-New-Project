import { Link } from 'react-router-dom';

function TeacherDetail(){
    return(
        <div className="container mt-4">
        <div className="row">
            <div className="col-4" >
                <img src="/student.png" className="img-thumbnail" alt="  "/>
            </div>
            <div className="col-8">
                <h3>Madam Vancy</h3>
                <p className='font-monospae'>Using a combination of grid and utility classes, cards can be made horizontal in a mobile-friendly and responsive way.</p>
                <p className='fw-bold'>Units Teaching:<Link to='/category/Introduction'>Introduction</Link>,<Link to='/category/Introduction'> Swimming</Link>,<Link to='/category/Introduction'>Hopes and Rabbit</Link>,<Link to='/category/Introduction'>Piano Lesson  </Link>,<Link to='/category/Introduction'> User Stories </Link>,<Link to='/category/Introduction'>Agriculture </Link></p>
                <p className='fw-bold'>Recent Unit<Link to='/category/Introduction'> Agriculture unit</Link></p>
                <p className='fw-bold'>Ratings: 4/5</p>

            </div>
        </div>
        {/*Unit Videos*/}
        <div className="card mt-4">
            <div className="card-header">
                <h3><span className="fw-bold">Units Videos List </span></h3>
            </div>
            <div className="list-group list-group-flush">
                <Link to="/detail/1" className="list-group-item list-group-item-action">Introduction</Link>
                <Link to="/detail/1" className="list-group-item list-group-item-action">Swimming</Link>
                <Link to="/detail/1" className="list-group-item list-group-item-action">Hopes and Rabbit</Link>
                <Link to="/detail/1" className="list-group-item list-group-item-action">Piano Lesson</Link>
                <Link to="/detail/1" className="list-group-item list-group-item-action">User Stories</Link>
                <Link to="/detail/1" className="list-group-item list-group-item-action">Agriculture</Link>

            </div>
        </div>    
    </div>
    )
}
export default TeacherDetail;