import { useState } from 'react';
import axios from 'axios';
// import { Link } from "react-router-dom";
import TeacherSidebar from "./sidebar";

function AddUnit(){
    const [selectedCategory, setCategory] = useState('math');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const teacherId = localStorage.getItem('user_id');
            await axios.post(
                'http://localhost:5000/api/units/create',
                {
                    title,
                    description,
                    video_url: videoUrl,
                    category: selectedCategory,
                    teacher_id: teacherId,
                    start_date: startDate,
                    end_date: endDate
                },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            setSuccessMessage('Unit added successfully!');
            setErrorMessage('');
            setTitle('');
            setDescription('');
            setVideoUrl('');
            setCategory('math');
            setStartDate('');
            setEndDate('');
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Failed to add unit');
            setSuccessMessage('');
        }
    };

    return(
        <div className='container mt-4'>
            <div className='row'>
                <aside className="col-md-2">
                    <TeacherSidebar/>
                </aside>
                <section className="col-md-9">
                    <div className='card'>
                        <h5 className='class-header'> Add Units </h5>
                        <div className='card-body'>
                            <form onSubmit={handleSubmit}>
                                {successMessage && 
                                    <div className="alert alert-success">{successMessage}</div>}
                                {errorMessage && 
                                    <div className="alert alert-danger">{errorMessage}</div>}

                                <div className="mb-3">
                                    <label className="form-label">Title</label>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea 
                                        className="form-control"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Video URL</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={videoUrl}
                                        onChange={(e) => setVideoUrl(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Category</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={selectedCategory}
                                        onChange={(e) => setCategory(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Start Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">End Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <hr/>
                                <button type='submit' className='btn btn-warning'>Add Unit</button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </div>

    )
}
export default AddUnit;