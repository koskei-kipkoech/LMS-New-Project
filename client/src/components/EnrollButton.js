import React, { useState } from 'react';
import { enrollmentService } from '../services/apiService';

export default function EnrollButton({ unitId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleEnroll = async () => {
    setIsLoading(true);
    try {
      const response = await enrollmentService.createEnrollment(unitId);
      if (response.status === 201) {
        setMessage('Enrollment successful!');
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Enrollment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="enroll-section">
      <button 
        onClick={handleEnroll}
        disabled={isLoading}
        className="enroll-button"
      >
        {isLoading ? 'Enrolling...' : 'Enroll in this Unit'}
      </button>
      {message && <div className="enroll-message">{message}</div>}
    </div>
  );
}