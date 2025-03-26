import axios from 'axios';

const UpdateProgress = ({ unitId, currentProgress, onProgressUpdate }) => {
    const handleProgressChange = async (newProgress) => {
        try {
            const studentId = localStorage.getItem('user_id');
            const token = localStorage.getItem('token');
            
            await axios.put(
                `http://localhost:5000/api/student/units/${studentId}/${unitId}/progress`,
                { progress: newProgress },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            onProgressUpdate(newProgress);
        } catch (error) {
            if (error.response?.status === 403) {
                localStorage.removeItem('token');
                localStorage.removeItem('user_id');
                window.location.href = '/login';
            } else {
                alert('Failed to update progress. Please try again.');
            }
        }
    };

    return (
        <div className="d-flex align-items-center">
            <button 
                className="btn btn-sm btn-outline-primary me-2"
                onClick={() => handleProgressChange(Math.min(100, currentProgress + 10))}
                disabled={currentProgress >= 100}
            >
                +10%
            </button>
            <button 
                className="btn btn-sm btn-outline-secondary"
                onClick={() => handleProgressChange(Math.max(0, currentProgress - 10))}
                disabled={currentProgress <= 0}
            >
                -10%
            </button>
        </div>
    );
};

export default UpdateProgress;