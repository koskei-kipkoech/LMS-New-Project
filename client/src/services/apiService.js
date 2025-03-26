import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

// Add request interceptor for JWT token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData)
};

export const unitService = {
  getAllUnits: async (page = 1, sortBy = 'title') => {
        const response = await axios.get(
            `${api.defaults.baseURL}/units`,
            {
                params: {
                    page,
                    sort_by: sortBy
                }
            }
        );
        return response;
    },
  getUnitDetails: (id) => api.get(`/units/${id}`),
  createUnit: (unitData) => api.post('/units/create', unitData)
};

export const enrollmentService = {
  createEnrollment: (unitId) => api.post('/enrollments', { unit_id: unitId }),
  getUserEnrollments: () => api.get('/enrollments')
};

export const ratingService = {
  submitRating: (unitId, score) => api.post('/ratings', { unit_id: unitId, score }),
  getUnitRatings: (unitId) => api.get(`/units/${unitId}/ratings`)
};