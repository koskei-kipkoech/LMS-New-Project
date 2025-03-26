function About() {
    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-md-12 text-center mb-5">
                    <h1 className="display-4 fw-bold">About Us</h1>
                    <p className="lead text-muted">Empowering Education Through Technology</p>
                </div>
            </div>
            <div className="row mb-5">
                <div className="col-md-6">
                    <h2 className="h3 mb-4">Our Mission</h2>
                    <p className="text-muted">We are dedicated to providing high-quality online education that is accessible, engaging, and effective. Our platform connects students with expert educators, fostering a dynamic learning environment that promotes academic excellence and personal growth.</p>
                </div>
                <div className="col-md-6">
                    <h2 className="h3 mb-4">Our Vision</h2>
                    <p className="text-muted">To revolutionize education by creating an innovative learning platform that breaks down barriers to education and empowers learners worldwide to achieve their full potential.</p>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12 text-center mb-5">
                    <h2 className="h3 mb-4">Our Team</h2>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <h3 className="h5">Academic Excellence</h3>
                            <p className="text-muted">Our experienced educators ensure the highest standards of teaching and learning.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <h3 className="h5">Innovation</h3>
                            <p className="text-muted">We leverage cutting-edge technology to create engaging learning experiences.</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                            <h3 className="h5">Student Support</h3>
                            <p className="text-muted">Dedicated support team available to help students achieve their goals.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;