import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

function Home() {
    const [latestUnits, setLatestUnits] = useState([]);
    const [featuredTeachers, setFeaturedTeachers] = useState([]);
    const [popularUnits, setPopularUnits] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sectionLoading, setSectionLoading] = useState({
        latest: true,
        featured: true,
        popular: true,
        testimonials: true
    });
    const [stats, setStats] = useState({ students: 0, courses: 0, instructors: 0, ratings: 0 });

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            await Promise.all([
                fetchLatestUnits(),
                fetchFeaturedTeachers(),
                fetchPopularUnits(),
                fetchTestimonials(),
                fetchStats()
            ]);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        document.title = 'LMS | Transform Your Learning Experience';
        fetchAllData();
    }, []);

    const fetchLatestUnits = async () => {
        try {
            setSectionLoading(prev => ({ ...prev, latest: true }));
            const response = await axios.get('http://localhost:5000/api/units/latest');
            setLatestUnits(response.data);
            return response;
        } catch (error) {
            console.error('Error fetching latest units:', error);
            setError('Failed to load latest units. Please try again later.');
        } finally {
            setSectionLoading(prev => ({ ...prev, latest: false }));
        }
    };

    const fetchFeaturedTeachers = async () => {
        try {
            setSectionLoading(prev => ({ ...prev, featured: true }));
            const response = await axios.get('http://localhost:5000/api/teacher/');
            setFeaturedTeachers(response.data.slice(0, 3));
            return response;
        } catch (error) {
            console.error('Error fetching featured teachers:', error);
            setError('Failed to load featured teachers. Please try again later.');
        } finally {
            setSectionLoading(prev => ({ ...prev, featured: false }));
        }
    };

    const fetchPopularUnits = async () => {
        try {
            setSectionLoading(prev => ({ ...prev, popular: true }));
            const response = await axios.get('http://localhost:5000/api/units/popular');
            setPopularUnits(response.data);
            return response;
        } catch (error) {
            console.error('Error fetching popular units:', error);
            setError('Failed to load popular units. Please try again later.');
        } finally {
            setSectionLoading(prev => ({ ...prev, popular: false }));
        }
    };

    const fetchTestimonials = async () => {
        try {
            setSectionLoading(prev => ({ ...prev, testimonials: true }));
            const response = await axios.get('http://localhost:5000/api/testimonials');
            setTestimonials(response.data);
            return response;
        } catch (error) {
            console.error('Error fetching testimonials:', error);
            setError('Failed to load testimonials. Please try again later.');
        } finally {
            setSectionLoading(prev => ({ ...prev, testimonials: false }));
        }
    };
    
    const fetchStats = async () => {
        try {
            // Replace with actual API endpoint when available
            // Mock data for now
            setStats({
                students: 3500,
                courses: 250,
                instructors: 85,
                ratings: 4.8
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        window.location.href = `/search?q=${searchQuery}`;
    };

    if (error) {
        return (
            <div className="alert alert-danger m-4" role="alert">
                {error}
                <button
                    onClick={() => {
                        setError(null);
                        fetchAllData();
                    }}
                    className="btn btn-outline-danger ms-3"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero position-relative overflow-hidden bg-gradient-primary text-white">
                <div className="hero-shape position-absolute top-0 start-0 w-100 h-100 z-index-0">
                    <svg className="position-absolute bottom-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                        <path fill="#ffffff" fillOpacity="0.1" d="M0,192L48,165.3C96,139,192,85,288,85.3C384,85,480,139,576,181.3C672,224,768,256,864,229.3C960,203,1056,117,1152,85.3C1248,53,1344,75,1392,85.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
                <div className="container py-6 position-relative z-index-1">
                    <div className="row align-items-center min-vh-75">
                        <motion.div 
                            className="col-lg-6 mb-5 mb-lg-0"
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                        >
                            <h1 className="display-3 fw-bold mb-4">Unlock Your Potential with Expert-Led Courses</h1>
                            <p className="lead fs-4 mb-5 opacity-80">Join thousands of students already learning with our comprehensive, interactive learning platform. Discover courses taught by industry experts.</p>
                            
                            <form onSubmit={handleSearch} className="search-form d-flex mb-5">
                                <div className="input-group input-group-lg">
                                    <input 
                                        type="text" 
                                        className="form-control border-0 shadow-sm py-3" 
                                        placeholder="What do you want to learn today?"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        aria-label="Search courses"
                                    />
                                    <button className="btn btn-lg btn-warning px-4" type="submit">
                                        <i className="bi bi-search me-2"></i>
                                        Search
                                    </button>
                                </div>
                            </form>
                            
                            <div className="d-flex gap-3 hero-cta">
                                <Link to="/all-units" className="btn btn-lg btn-light">
                                    Browse Courses
                                </Link>
                                <Link to="/register" className="btn btn-lg btn-outline-light">
                                    Sign Up Free
                                </Link>
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            className="col-lg-6"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="position-relative">
                                <img 
                                    src="/background.png" 
                                    alt="Learning Experience" 
                                    className="img-fluid rounded-lg shadow-lg hover:scale-105 transition-transform duration-300" 
                                    style={{ maxWidth: '100%', height: 'auto' }}
                                />
                                <div className="position-absolute top-0 end-0 translate-middle-y">
                                    <div className="badge bg-warning p-3 rounded-pill">
                                        <div className="d-flex align-items-center">
                                            <i className="bi bi-lightning-charge-fill fs-4 me-2"></i>
                                            <span className="fs-5">Live Classes</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section py-5 bg-light border-bottom">
                <div className="container">
                    <div className="row g-4 justify-content-center text-center">
                        <div className="col-6 col-md-3">
                            <div className="stat-card p-4">
                                <h2 className="display-5 fw-bold text-primary mb-2 counter">
                                    {stats.students.toLocaleString()}+
                                </h2>
                                <p className="text-uppercase fw-bold mb-0 small">Active Students</p>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="stat-card p-4">
                                <h2 className="display-5 fw-bold text-primary mb-2 counter">
                                    {stats.courses.toLocaleString()}+
                                </h2>
                                <p className="text-uppercase fw-bold mb-0 small">Total Courses</p>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="stat-card p-4">
                                <h2 className="display-5 fw-bold text-primary mb-2 counter">
                                    {stats.instructors.toLocaleString()}+
                                </h2>
                                <p className="text-uppercase fw-bold mb-0 small">Expert Instructors</p>
                            </div>
                        </div>
                        <div className="col-6 col-md-3">
                            <div className="stat-card p-4">
                                <h2 className="display-5 fw-bold text-primary mb-2 counter">
                                    {stats.ratings}
                                </h2>
                                <p className="text-uppercase fw-bold mb-0 small">Average Rating</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest Units */}
            <section className="latest-units py-6">
                <div className="container">
                    <motion.div 
                        className="section-header text-center mb-5"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <h6 className="text-uppercase text-primary fw-bold mb-2">New & Fresh</h6>
                        <h2 className="display-5 fw-bold">Latest Courses</h2>
                        <p className="lead text-muted">Expand your skills with our newest educational offerings</p>
                    </motion.div>
                    
                    <div className="row g-4">
                        {latestUnits.map((unit, index) => (
                            <motion.div 
                                key={index} 
                                className="col-md-6 col-lg-4"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div className="card h-100 shadow course-card border-0">
                                    <div className="position-relative">
                                        <Link to={`/detail/${unit.id}`}>
                                            <img 
                                                src={unit.image || "/course-placeholder.jpg"} 
                                                className="card-img-top" 
                                                alt={unit.title} 
                                                style={{height: '220px', objectFit: 'cover'}} 
                                            />
                                        </Link>
                                        <div className="position-absolute top-0 start-0 m-3">
                                            <span className="badge bg-danger">New</span>
                                        </div>
                                    </div>
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="badge rounded-pill bg-light text-dark">
                                                {unit.category || 'Uncategorized'}
                                            </span>
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-star-fill text-warning me-1"></i>
                                                <span>{unit.rating?.toFixed(1) || '0.0'}</span>
                                            </div>
                                        </div>
                                        <h5 className="card-title mb-3">
                                            <Link to={`/detail/${unit.id}`} className="text-decoration-none text-dark stretched-link">
                                                {unit.title}
                                            </Link>
                                        </h5>
                                        <p className="card-text text-muted mb-4">{unit.description?.substring(0, 80)}...</p>
                                        <div className="d-flex justify-content-between align-items-center mt-auto">
                                            <div className="d-flex align-items-center">
                                                <img 
                                                    src={unit.teacher_image || "/teacher-placeholder.jpg"} 
                                                    alt="Instructor" 
                                                    className="rounded-circle me-2" 
                                                    width="30" 
                                                    height="30" 
                                                />
                                                <span className="small text-muted">{unit.teacher_name || 'Instructor'}</span>
                                            </div>
                                            <span className="text-primary fw-bold">
                                                {unit.students_count || 0} students
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    
                    <div className="text-center mt-5">
                        <Link to="/all-units" className="btn btn-outline-primary px-4 py-2">
                            View All Courses <i className="bi bi-arrow-right ms-2"></i>
                        </Link>
                    </div>
                </div>
            </section>
            
            {/* Featured Teachers */}
            <section className="featured-teachers py-6 bg-light">
                <div className="container">
                    <motion.div 
                        className="section-header text-center mb-5"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <h6 className="text-uppercase text-primary fw-bold mb-2">Expert Instructors</h6>
                        <h2 className="display-5 fw-bold">Learn From The Best</h2>
                        <p className="lead text-muted">Our instructors bring real-world expertise to every course</p>
                    </motion.div>
                    
                    <div className="row g-4 justify-content-center">
                        {featuredTeachers.map((teacher, index) => (
                            <motion.div 
                                key={index} 
                                className="col-md-6 col-lg-4"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div className="card h-100 border-0 shadow instructor-card">
                                    <div className="position-relative instructor-img-container">
                                        <img 
                                            src={teacher.profile_pic || "/teacher-placeholder.jpg"} 
                                            className="card-img-top instructor-img" 
                                            alt={teacher.username}
                                            style={{height: '280px', objectFit: 'cover'}}
                                        />
                                        <div className="instructor-overlay d-flex align-items-center justify-content-center">
                                            <div className="d-flex gap-2">
                                                <a href="#" className="btn btn-sm btn-light rounded-circle p-2">
                                                    <i className="bi bi-linkedin"></i>
                                                </a>
                                                <a href="#" className="btn btn-sm btn-light rounded-circle p-2">
                                                    <i className="bi bi-twitter"></i>
                                                </a>
                                                <a href="#" className="btn btn-sm btn-light rounded-circle p-2">
                                                    <i className="bi bi-envelope"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body text-center p-4">
                                        <h5 className="card-title mb-1">
                                            <Link to={`/teacher-detail/${teacher.id}`} className="text-decoration-none text-dark">
                                                {teacher.username}
                                            </Link>
                                        </h5>
                                        <p className="text-primary mb-3">{teacher.qualifications || 'Instructor'}</p>
                                        <p className="card-text text-muted small mb-4">
                                            {teacher.bio?.substring(0, 100)}...
                                        </p>
                                        <div className="d-flex justify-content-between align-items-center border-top pt-3">
                                            <div className="instructor-stat">
                                                <span className="d-block fw-bold">{teacher.total_units || 0}</span>
                                                <small className="text-muted">Courses</small>
                                            </div>
                                            <div className="instructor-stat">
                                                <span className="d-block fw-bold">{teacher.students_count || 0}</span>
                                                <small className="text-muted">Students</small>
                                            </div>
                                            <div className="instructor-stat">
                                                <span className="d-block fw-bold">
                                                    <i className="bi bi-star-fill text-warning me-1"></i>
                                                    {teacher.rating?.toFixed(1) || '0.0'}
                                                </span>
                                                <small className="text-muted">Rating</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    
                    <div className="text-center mt-5">
                        <Link to="/featured-teachers" className="btn btn-outline-primary px-4 py-2">
                            View All Instructors <i className="bi bi-arrow-right ms-2"></i>
                        </Link>
                    </div>
                </div>
            </section>
            
            {/* Popular Units */}
            <section className="popular-courses py-6">
                <div className="container">
                    <motion.div 
                        className="section-header text-center mb-5"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <h6 className="text-uppercase text-primary fw-bold mb-2">Top Rated</h6>
                        <h2 className="display-5 fw-bold">Most Popular Courses</h2>
                        <p className="lead text-muted">Join thousands of students in our highest-rated courses</p>
                    </motion.div>
                    
                    <div className="row g-4">
                        {popularUnits.map((unit, index) => (
                            <motion.div 
                                key={index} 
                                className="col-md-6 col-lg-4"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div className="card h-100 shadow course-card border-0">
                                    <div className="position-relative">
                                        <Link to={`/detail/${unit.id}`}>
                                            <img 
                                                src={unit.image || "/course-placeholder.jpg"} 
                                                className="card-img-top" 
                                                alt={unit.title} 
                                                style={{height: '220px', objectFit: 'cover'}} 
                                            />
                                        </Link>
                                        <div className="position-absolute top-0 start-0 m-3">
                                            <span className="badge bg-success">
                                                <i className="bi bi-star-fill me-1"></i>
                                                Popular
                                            </span>
                                        </div>
                                        <div className="position-absolute bottom-0 start-0 m-3">
                                            <span className="badge bg-dark px-3 py-2">
                                                {unit.enrollments_count || 0} enrolled
                                            </span>
                                        </div>
                                    </div>
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="badge rounded-pill bg-light text-dark">
                                                {unit.category || 'Uncategorized'}
                                            </span>
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-star-fill text-warning me-1"></i>
                                                <span>{unit.rating?.toFixed(1) || '0.0'}</span>
                                            </div>
                                        </div>
                                        <h5 className="card-title mb-3">
                                            <Link to={`/detail/${unit.id}`} className="text-decoration-none text-dark stretched-link">
                                                {unit.title}
                                            </Link>
                                        </h5>
                                        <p className="card-text text-muted mb-4">{unit.description?.substring(0, 80)}...</p>
                                        <div className="d-flex justify-content-between align-items-center mt-auto">
                                            <div className="d-flex align-items-center">
                                                <img 
                                                    src={unit.teacher_image || "/teacher-placeholder.jpg"} 
                                                    alt="Instructor" 
                                                    className="rounded-circle me-2" 
                                                    width="30" 
                                                    height="30" 
                                                />
                                                <span className="small text-muted">{unit.teacher_name || 'Instructor'}</span>
                                            </div>
                                            <div className="course-meta">
                                                <small className="text-muted">
                                                    <i className="bi bi-clock me-1"></i>
                                                    {unit.duration || '8 weeks'}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    
                    <div className="text-center mt-5">
                        <Link to="/popular-units" className="btn btn-outline-primary px-4 py-2">
                            View All Popular Courses <i className="bi bi-arrow-right ms-2"></i>
                        </Link>
                    </div>
                </div>
            </section>
            
            {/* Call to Action */}
            <section className="cta-section py-6 bg-primary text-white">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8 mx-auto text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <h2 className="display-4 fw-bold mb-4">Ready to Start Your Learning Journey?</h2>
                                <p className="lead mb-5">Join thousands of students already transforming their careers with our expert-led courses.</p>
                                <div className="d-flex gap-3 justify-content-center">
                                    <Link to="/register" className="btn btn-lg btn-warning px-4">
                                        Get Started Free
                                    </Link>
                                    <Link to="/all-units" className="btn btn-lg btn-outline-light px-4">
                                        Browse All Courses
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Testimonials */}
            <section className="testimonials-section py-6 bg-light">
                <div className="container">
                    <motion.div 
                        className="section-header text-center mb-5"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <h6 className="text-uppercase text-primary fw-bold mb-2">Testimonials</h6>
                        <h2 className="display-5 fw-bold">What Our Students Say</h2>
                        <p className="lead text-muted">Real stories from our successful students</p>
                    </motion.div>
                    
                    <div id="testimonialCarousel" className="carousel slide testimonial-carousel" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                    <div className="row justify-content-center">
                                        <div className="col-lg-8">
                                            <div className="testimonial-card shadow bg-white p-5 rounded-lg">
                                                <div className="d-flex align-items-center mb-4">
                                                    <img 
                                                        src={testimonial.student_image || '/student-placeholder.jpg'} 
                                                        alt={testimonial.student_name} 
                                                        className="rounded-circle testimonial-img me-4" 
                                                        width="80"
                                                        height="80"
                                                    />
                                                    <div>
                                                        <h5 className="mb-1">{testimonial.student_name}</h5>
                                                        <p className="text-primary mb-0">
                                                            {testimonial.unit_name}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mb-4">
                                                    <i className="bi bi-star-fill text-warning"></i>
                                                    <i className="bi bi-star-fill text-warning"></i>
                                                    <i className="bi bi-star-fill text-warning"></i>
                                                    <i className="bi bi-star-fill text-warning"></i>
                                                    <i className="bi bi-star-fill text-warning"></i>
                                                </div>
                                                <blockquote className="blockquote mb-0">
                                                    <p className="fs-5 fst-italic mb-0">"{testimonial.content}"</p>
                                                </blockquote>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon bg-primary rounded-circle p-3" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
                            <span className="carousel-control-next-icon bg-primary rounded-circle p-3" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                        <div className="carousel-indicators testimonial-indicators position-relative mt-4">
                            {testimonials.map((_, index) => (
                                <button 
                                    key={index}
                                    type="button" 
                                    data-bs-target="#testimonialCarousel" 
                                    data-bs-slide-to={index} 
                                    className={index === 0 ? 'active' : ''}
                                    aria-current={index === 0 ? 'true' : 'false'}
                                    aria-label={`Slide ${index + 1}`}
                                ></button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="text-center mt-5">
                        <Link to="/testimonials" className="btn btn-outline-primary px-4 py-2">
                            Read All Testimonials <i className="bi bi-arrow-right ms-2"></i>
                        </Link>
                    </div>
                </div>
            </section>
            
            {/* Newsletter */}
            <section className="newsletter-section py-5 bg-white border-top">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="text-center">
                                <h3 className="mb-3">Stay Updated</h3>
                                <p className="text-muted mb-4">Subscribe to our newsletter for the latest course updates and learning tips</p>
                                <form className="newsletter-form d-flex justify-content-center">
                                    <div className="input-group">
                                        <input 
                                            type="email" 
                                            className="form-control" 
                                            placeholder="Your email address" 
                                            aria-label="Email address" 
                                        />
                                        <button className="btn btn-primary" type="button">Subscribe</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
        </div>
    )
}
export default Home;