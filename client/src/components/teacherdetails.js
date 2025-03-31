import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

function TeacherDetail() {
  const { teacher_id } = useParams(); // using teacher_id as defined in the route
  const [teacherData, setTeacherData] = useState({
    id: null,
    username: '',
    bio: '',
    qualifications: '',
    units: [],
    ratings: { average: 0, count: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!teacher_id) {
      console.error("No teacher ID provided in URL");
      setError('No teacher ID found');
      setLoading(false);
      return;
    }

    const fetchTeacherData = async () => {
      try {
        // console.log("Fetching teacher ID:", teacher_id);
        // Call the new endpoint that does not require a token
        const response = await axios.get(`http://localhost:5000/api/teacher/${teacher_id}`);
        // console.log("Teacher data response:", response.data);
        setTeacherData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching teacher data:', err);
        if (err.response) {
        //   console.log("Error response:", err.response.data);
        //   console.log("Error status:", err.response.status);
        }
        setError('Failed to load teacher data');
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [teacher_id]);

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (error) return <div className="container mt-4 text-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-4">
          {/* Replace '/student.png' with the teacher's profile image URL if available */}
          <img src="/student.png" className="img-thumbnail" alt={teacherData.username} />
        </div>
        <div className="col-8">
          <h3>{teacherData.username}</h3>
          <p className="font-monospace">{teacherData.bio || 'No bio available'}</p>
          <p><strong>Qualifications:</strong> {teacherData.qualifications || 'Not specified'}</p>
          <p className="fw-bold">
            Units Teaching:{" "}
            {teacherData.units.map((unit, index) => (
              <span key={unit.id}>
                {index > 0 && ', '}
                <Link to={`/category/${unit.category}`}>{unit.title}</Link>
              </span>
            ))}
          </p>
          {teacherData.units.length > 0 && (
            <p className="fw-bold">
              Recent Unit: <Link to={`/detail/${teacherData.units[0].id}`}>{teacherData.units[0].title}</Link>
            </p>
          )}
          <p className="fw-bold">
            Ratings: {teacherData.ratings.average.toFixed(1)}/5 ({teacherData.ratings.count} ratings)
          </p>
        </div>
      </div>
      <div className="card mt-4">
        <div className="card-header">
          <h3 className="fw-bold">Units Videos List</h3>
        </div>
        <div className="list-group list-group-flush">
          {teacherData.units.length > 0 ? (
            teacherData.units.map(unit => (
              <Link 
                key={unit.id}
                to={`/detail/${unit.id}`} 
                className="list-group-item list-group-item-action"
              >
                {unit.title}
              </Link>
            ))
          ) : (
            <div className="list-group-item">No units available</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeacherDetail;
