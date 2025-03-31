import { Link } from 'react-router-dom';
import { useState } from 'react';

function Header() {
    const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle
    const [teacherDropdownOpen, setTeacherDropdownOpen] = useState(false); // Teacher dropdown toggle
    const [userDropdownOpen, setUserDropdownOpen] = useState(false); // User dropdown toggle

    // Function to close all dropdowns
    const closeDropdowns = () => {
        setTeacherDropdownOpen(false);
        setUserDropdownOpen(false);
        setIsOpen(false); // Also close mobile menu if open
    };

    return (
        <nav className="bg-gray-800 text-white shadow-md sticky top-0 z-50 py-4">
            <div className="container mx-auto px-6 flex items-center justify-between flex-wrap">
                {/* Brand */}
                <Link to="/" className="text-2xl font-bold text-white hover:text-gray-300 transition">
                    Learn Online
                </Link>

                {/* Toggle Button for Mobile */}
                <button
                    className="md:hidden text-white focus:outline-none"
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle navigation"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>

                {/* Navigation Links */}
                <div
                    className={`${
                        isOpen ? 'flex' : 'hidden'
                    } md:flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6 w-full md:w-auto mt-4 md:mt-0`}
                    id="navbarNav"
                >
                    <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
                        <li>
                            <Link to="/" className="text-white hover:text-indigo-400 transition font-medium" onClick={closeDropdowns}>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className="text-white hover:text-indigo-400 transition font-medium" onClick={closeDropdowns}>
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link to="/all-units" className="text-white hover:text-indigo-400 transition font-medium" onClick={closeDropdowns}>
                                Units
                            </Link>
                        </li>
                        {/* Teacher Dropdown */}
                        <li className="relative">
                            <span
                                className="text-white hover:text-indigo-400 transition font-medium cursor-pointer flex items-center"
                                onClick={() => setTeacherDropdownOpen(!teacherDropdownOpen)}
                            >
                                Teacher
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </span>
                            <ul
                                className={`${
                                    teacherDropdownOpen ? 'block' : 'hidden'
                                } absolute bg-gray-700 text-white rounded-lg shadow-lg mt-2 w-48 z-50`}
                            >
                                <li>
                                    <Link
                                        to="/teacher-login"
                                        className="block px-4 py-2 hover:bg-gray-600 transition"
                                        onClick={closeDropdowns}
                                    >
                                        Log In
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/teacher-register"
                                        className="block px-4 py-2 hover:bg-gray-600 transition"
                                        onClick={closeDropdowns}
                                    >
                                        Register
                                    </Link>
                                </li>
                                <li>
                                    <hr className="border-gray-600" />
                                </li>
                                <li>
                                    <Link
                                        to="/teacher-dashboard"
                                        className="block px-4 py-2 hover:bg-gray-600 transition"
                                        onClick={closeDropdowns}
                                    >
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/teacher-logout"
                                        className="block px-4 py-2 hover:bg-gray-600 transition"
                                        onClick={closeDropdowns}
                                    >
                                        Log Out
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <Link to="/finance" className="text-white hover:text-indigo-400 transition font-medium" onClick={closeDropdowns}>
                                Finance
                            </Link>
                        </li>
                        {/* User Dropdown */}
                        <li className="relative">
                            <span
                                className="text-white hover:text-indigo-400 transition font-medium cursor-pointer flex items-center"
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                            >
                                User
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </span>
                            <ul
                                className={`${
                                    userDropdownOpen ? 'block' : 'hidden'
                                } absolute bg-gray-700 text-white rounded-lg shadow-lg mt-2 w-48 z-50`}
                            >
                                <li>
                                    <Link
                                        to="/user-login"
                                        className="block px-4 py-2 hover:bg-gray-600 transition"
                                        onClick={closeDropdowns}
                                    >
                                        Log In
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/user-register"
                                        className="block px-4 py-2 hover:bg-gray-600 transition"
                                        onClick={closeDropdowns}
                                    >
                                        Register
                                    </Link>
                                </li>
                                <li>
                                    <hr className="border-gray-600" />
                                </li>
                                <li>
                                    <Link
                                        to="/user-dashboard"
                                        className="block px-4 py-2 hover:bg-gray-600 transition"
                                        onClick={closeDropdowns}
                                    >
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/user-logout"
                                        className="block px-4 py-2 hover:bg-gray-600 transition"
                                        onClick={closeDropdowns}
                                    >
                                        Log Out
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>

                    {/* Search Form */}
                    <form className="flex w-full md:w-auto mt-4 md:mt-0">
                        <input
                            type="search"
                            className="w-full md:w-64 px-4 py-2 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Search"
                            aria-label="Search"
                        />
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 transition"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </div>
        </nav>
    );
}

export default Header;