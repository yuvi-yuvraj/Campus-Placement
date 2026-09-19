import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          
          const { token, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Clear tokens and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  studentRegister: (data) => api.post('/auth/student/register', data),
  studentLogin: (data) => api.post('/auth/student/login', data),
  adminLogin: (data) => api.post('/auth/admin/login', data),
};

// Student APIs
export const studentAPI = {
  getProfile: () => api.get('/student/profile'),
  updateProfile: (data) => api.put('/student/profile', data),
  getDashboard: () => api.get('/student/dashboard'),
  getJobs: () => api.get('/student/jobs'),
  getJob: (id) => api.get(`/student/job/${id}`),
  applyToJob: (jobId) => api.post(`/student/apply/${jobId}`),
  getApplications: () => api.get('/student/applications'),
  getInternships: () => api.get('/student/internships'),
  getWebinars: () => api.get('/student/webinars'),
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  // Jobs
  createJob: (data) => api.post('/admin/job', data),
  updateJob: (id, data) => api.put(`/admin/job/${id}`, data),
  deleteJob: (id) => api.delete(`/admin/job/${id}`),
  getAllJobs: () => api.get('/admin/jobs'),
  getJobApplicants: (jobId) => api.get(`/admin/job/applicants/${jobId}`),
  // Applications
  approveApplication: (id, remarks) => api.post(`/admin/application/${id}/approve`, { remarks }),
  rejectApplication: (id, remarks) => api.post(`/admin/application/${id}/reject`, { remarks }),
  // Internships
  createInternship: (data) => api.post('/admin/internship', data),
  updateInternship: (id, data) => api.put(`/admin/internship/${id}`, data),
  deleteInternship: (id) => api.delete(`/admin/internship/${id}`),
  getAllInternships: () => api.get('/admin/internships'),
  // Webinars
  createWebinar: (data) => api.post('/admin/webinar', data),
  updateWebinar: (id, data) => api.put(`/admin/webinar/${id}`, data),
  deleteWebinar: (id) => api.delete(`/admin/webinar/${id}`),
  getAllWebinars: () => api.get('/admin/webinars'),
};

export default api;
