
function Footer() {
    return (
        <footer className="bg-dark text-light py-4">
            <div className="container">
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <h5 className="text-white mb-3">Contact Us</h5>
                        <p className="mb-1"><i className="bi bi-geo-alt-fill me-2"></i>P.O. BOX 130, Litein, Kenya</p>
                        <p className="mb-1"><i className="bi bi-telephone-fill me-2"></i>(+254) 729 401 764</p>
                        <p className="mb-1"><i className="bi bi-phone-fill me-2"></i>(+254) 758 306 675</p>
                        <p className="mb-1"><i className="bi bi-envelope-fill me-2"></i>patrickwayy@gmail.com</p>
                    </div>
                    <div className="col-md-4 mb-3">
                        <h5 className="text-white mb-3">Quick Links</h5>
                        <ul className="list-unstyled">
                            <li><a href="/" className="text-light text-decoration-none">Home</a></li>
                            <li><a href="/all-units" className="text-light text-decoration-none">Units</a></li>
                            <li><a href="/about" className="text-light text-decoration-none">About Us</a></li>
                        </ul>
                    </div>
                    <div className="col-md-4 mb-3">
                        <h5 className="text-white mb-3">Connect With Us</h5>
                        <div className="d-flex gap-3">
                            <a href="#" className="text-light fs-5"><i className="bi bi-facebook"></i></a>
                            <a href="#" className="text-light fs-5"><i className="bi bi-twitter"></i></a>
                            <a href="#" className="text-light fs-5"><i className="bi bi-linkedin"></i></a>
                            <a href="#" className="text-light fs-5"><i className="bi bi-instagram"></i></a>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-12 text-center">
                        <p className="mb-0">&copy; {new Date().getFullYear()} Learn Online. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
  
  export default Footer;
  