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
        } catch (error) {
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
        } catch (error) {
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
        } catch (error) {
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
        } catch (error) {
            setError('Failed to load testimonials. Please try again later.');
        } finally {
            setSectionLoading(prev => ({ ...prev, testimonials: false }));
        }
    };

    const fetchStats = async () => {
        try {
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
            <div className="max-w-4xl mx-auto mt-10 p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center justify-between">
                <span>{error}</span>
                <button
                    onClick={() => {
                        setError(null);
                        fetchAllData();
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-20 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center">
                        <motion.div
                            className="md:w-1/2 mb-10 md:mb-0"
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                        >
                            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                                Unlock Your Potential with Expert-Led Courses
                            </h1>
                            <p className="text-lg md:text-xl mb-8 opacity-90">
                                Join thousands of learners mastering new skills with our interactive platform.
                            </p>
                            <form onSubmit={handleSearch} className="flex mb-8">
                                <input
                                    type="text"
                                    className="w-full max-w-md p-4 rounded-l-lg text-gray-900 focus:outline-none"
                                    placeholder="What do you want to learn today?"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button className="bg-yellow-400 text-gray-900 p-4 rounded-r-lg hover:bg-yellow-500 transition">
                                    Search
                                </button>
                            </form>
                            <div className="flex gap-4">
                                <Link to="/all-units" className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                                    Browse Courses
                                </Link>
                                <Link to="/user-register" className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition">
                                    Sign Up Free
                                </Link>
                            </div>
                        </motion.div>
                        <motion.div
                            className="md:w-1/2"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <img
                                src="/lms.jpg"
                                alt="Learning Experience"
                                className="w-full rounded-lg shadow-xl transform hover:scale-105 transition duration-300"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <h2 className="text-4xl font-bold text-indigo-600">{stats.students.toLocaleString()}+</h2>
                            <p className="text-gray-600">Active Students</p>
                        </div>
                        <div>
                            <h2 className="text-4xl font-bold text-indigo-600">{stats.courses.toLocaleString()}+</h2>
                            <p className="text-gray-600">Total Courses</p>
                        </div>
                        <div>
                            <h2 className="text-4xl font-bold text-indigo-600">{stats.instructors.toLocaleString()}+</h2>
                            <p className="text-gray-600">Expert Instructors</p>
                        </div>
                        <div>
                            <h2 className="text-4xl font-bold text-indigo-600">{stats.ratings}</h2>
                            <p className="text-gray-600">Average Rating</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest Units */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <h6 className="text-indigo-600 font-semibold uppercase">New & Fresh</h6>
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Latest Courses</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Expand your skills with our newest educational offerings.</p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {latestUnits.map((unit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                                    <Link to={`/detail/${unit.id}`}>
                                        <img
                                            src={unit.image || "/uni.jpg"}
                                            alt={unit.title}
                                            className="w-full h-56 object-cover"
                                        />
                                    </Link>
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
                                                {unit.category || 'Uncategorized'}
                                            </span>
                                            <div className="flex items-center text-yellow-500">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                {unit.rating?.toFixed(1) || '0.0'}
                                            </div>
                                        </div>
                                        <h5 className="text-xl font-semibold text-gray-800 mb-3">
                                            <Link to={`/detail/${unit.id}`} className="hover:text-indigo-600 transition">
                                                {unit.title}
                                            </Link>
                                        </h5>
                                        <p className="text-gray-600 mb-4">{unit.description?.substring(0, 80)}...</p>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <img
                                                    src={unit.teacher_image || "/teacher.png"}
                                                    alt="Instructor"
                                                    className="w-8 h-8 rounded-full mr-2"
                                                />
                                                <span className="text-gray-600 text-sm">{unit.teacher_name || 'Instructor'}</span>
                                            </div>
                                            <span className="text-indigo-600 font-semibold">{unit.students_count || 0} students</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <Link to="/all-units" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                            View All Courses
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Teachers */}
            <section className="py-16 bg-gray-100">
                <div className="container mx-auto px-6">
                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <h6 className="text-indigo-600 font-semibold uppercase">Expert Instructors</h6>
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Learn From The Best</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Our instructors bring real-world expertise to every course.</p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredTeachers.map((teacher, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                                    <img
                                        src={teacher.profile_pic || "/teacher.png"}
                                        alt={teacher.username}
                                        className="w-full h-64 object-cover"
                                    />
                                    <div className="p-6 text-center">
                                        <h5 className="text-xl font-semibold text-gray-800 mb-2">
                                            <Link to={`/teacher-detail/${teacher.id}`} className="hover:text-indigo-600 transition">
                                                {teacher.username}
                                            </Link>
                                        </h5>
                                        <p className="text-indigo-600 mb-3">{teacher.qualifications || 'Instructor'}</p>
                                        <p className="text-gray-600 mb-4">{teacher.bio?.substring(0, 100)}...</p>
                                        <div className="flex justify-around text-gray-600 border-t pt-4">
                                            <div>
                                                <span className="block font-semibold">{teacher.total_units || 0}</span>
                                                <span className="text-sm">Courses</span>
                                            </div>
                                            <div>
                                                <span className="block font-semibold">{teacher.students_count || 0}</span>
                                                <span className="text-sm">Students</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span className="font-semibold">{teacher.rating?.toFixed(1) || '0.0'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <Link to="/user-register" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                            View All Instructors
                        </Link>
                    </div>
                </div>
            </section>

            {/* Popular Units */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <h6 className="text-indigo-600 font-semibold uppercase">Top Rated</h6>
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Most Popular Courses</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Join thousands of students in our highest-rated courses.</p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {popularUnits.map((unit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                                    <Link to={`/detail/${unit.id}`}>
                                        <img
                                            src={unit.image || "/student.png"}
                                            alt={unit.title}
                                            className="w-full h-56 object-cover"
                                        />
                                    </Link>
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
                                                {unit.category || 'Uncategorized'}
                                            </span>
                                            <div className="flex items-center text-yellow-500">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                {unit.rating?.toFixed(1) || '0.0'}
                                            </div>
                                        </div>
                                        <h5 className="text-xl font-semibold text-gray-800 mb-3">
                                            <Link to={`/detail/${unit.id}`} className="hover:text-indigo-600 transition">
                                                {unit.title}
                                            </Link>
                                        </h5>
                                        <p className="text-gray-600 mb-4">{unit.description?.substring(0, 80)}...</p>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <img
                                                    src={unit.teacher_image || "/teacher.png"}
                                                    alt="Instructor"
                                                    className="w-8 h-8 rounded-full mr-2"
                                                />
                                                <span className="text-gray-600 text-sm">{unit.teacher_name || 'Instructor'}</span>
                                            </div>
                                            <span className="text-gray-600 text-sm">{unit.duration || '8 weeks'}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <Link to="/user-register" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                            View All Popular Courses
                        </Link>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 bg-indigo-600 text-white">
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl font-bold mb-4">Ready to Start Your Learning Journey?</h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of students already transforming their careers with our expert-led courses.</p>
                        <div className="flex justify-center gap-4">
                            <Link to="/user-register" className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition">
                                Get Started Free
                            </Link>
                            <Link to="/all-units" className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition">
                                Browse All Courses
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 bg-gray-100">
                <div className="container mx-auto px-6">
                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <h6 className="text-indigo-600 font-semibold uppercase">Testimonials</h6>
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Students Say</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Real stories from our successful students.</p>
                    </motion.div>
                    <div className="carousel slide" data-bs-ride="carousel" id="testimonialCarousel">
                        <div className="carousel-inner">
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                                        <div className="flex items-center mb-4">
                                            <img
                                                src={testimonial.student_image || '/std.png'}
                                                alt={testimonial.student_name}
                                                className="w-16 h-16 rounded-full mr-4"
                                            />
                                            <div>
                                                <h5 className="text-xl font-semibold text-gray-800">{testimonial.student_name}</h5>
                                                <p className="text-indigo-600">{testimonial.unit_name}</p>
                                            </div>
                                        </div>
                                        <div className="flex text-yellow-500 mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <p className="text-gray-600 italic">"{testimonial.content}"</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon bg-indigo-600 rounded-full p-2" aria-hidden="true"></span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
                            <span className="carousel-control-next-icon bg-indigo-600 rounded-full p-2" aria-hidden="true"></span>
                        </button>
                    </div>
                    <div className="text-center mt-10">
                        <Link to="/testimonials" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                            Read All Testimonials
                        </Link>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-12 bg-white border-t">
                <div className="container mx-auto px-6 text-center">
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">Stay Updated</h3>
                    <p className="text-gray-600 mb-6 max-w-xl mx-auto">Subscribe to our newsletter for the latest course updates and learning tips.</p>
                    <form className="flex justify-center max-w-md mx-auto">
                        <input
                            type="email"
                            className="w-full p-4 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            placeholder="Your email address"
                        />
                        <button className="bg-indigo-600 text-white p-4 rounded-r-lg hover:bg-indigo-700 transition">
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}

export default Home;