import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TeacherSidebar from './sidebar';
import axios from 'axios';

function StudentPerformance() {
    const [units, setUnits] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState('');
    const [studentData, setStudentData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/teacher/units', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUnits(response.data);
            } catch (error) {
                console.error('Error fetching units:', error);
            }
        };
        fetchUnits();
    }, []);

    useEffect(() => {
        if (selectedUnit) {
            const fetchStudentPerformance = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(`http://localhost:5000/api/teacher/units/${selectedUnit}/students`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    setStudentData(response.data);
                } catch (error) {
                    console.error('Error fetching student data:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchStudentPerformance();
        }
    }, [selectedUnit]);

    const handleGradeChange = async (studentId, field, value) => {
        const updatedData = studentData.map(student => {
            if (student.student_id === studentId) {
                return { ...student, [field]: value };
            }
            return student;
        });
        setStudentData(updatedData);

        try {
            await axios.put(`http://localhost:5000/api/teacher/students/${studentId}/grades`, {
                unit_id: selectedUnit,
                [field]: value
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
        } catch (error) {
            console.error('Error updating grades:', error);
        }
    };

    return (
        <div className='container mt-4'>
            <div className='row'>
                <aside className="col-md-2">
                    <TeacherSidebar />
                </aside>
                <section className="col-md-10">
                    <div className='card'>
                        <h5 className='card-header'>Student Performance</h5>
                        <div className='card-body'>
                            <div className='mb-4'>
                                <select
                                    className='form-select'
                                    value={selectedUnit}
                                    onChange={(e) => setSelectedUnit(e.target.value)}
                                >
                                    <option value=''>Select a Unit</option>
                                    {units.map(unit => (
                                        <option key={unit.id} value={unit.id}>{unit.title}</option>
                                    ))}
                                </select>
                            </div>
                        <div className='card-body'>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr>
                                        <th>Studdent Name</th>
                                        <th> Unit</th>
                                        <th>Assignment /10</th>
                                        <th>CAT /20</th>
                                        <th>End Month Exams /70</th>
                                        <th>Total in % </th>
                                        <th>Action</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    <td>Patrick kipkoech</td>
                                    <td><Link to='/'>Introduction 1</Link></td>
                                    <td>6</td>
                                    <td>16</td>
                                    <td>52</td>
                                    <td>73</td>
                                    <td><button className='btn btn-danger btn-sm danger active'>Delete</button></td>
                                </tbody>
                                <tbody>
                                    <td>Patrick kipkoech</td>
                                    <td><Link to='/'>Agriculture </Link></td>
                                    <td>4</td>
                                    <td>12</td>
                                    <td>60</td>
                                    <td>76</td>
                                    <td><button className='btn btn-danger btn-sm danger active'>Delete</button></td>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )

}

export default StudentPerformance;