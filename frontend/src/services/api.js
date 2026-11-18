const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('cf_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  if (res.status === 401) {
    localStorage.removeItem('cf_token');
    localStorage.removeItem('cf_user');
    if (!window.location.pathname.includes('/login') && window.location.pathname !== '/') {
      window.location.href = '/student/login';
    }
    throw new Error('Session expired. Please log in again.');
  }

  const contentType = res.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const errorMsg = (isJson && data.message) ? data.message : (typeof data === 'string' ? data : res.statusText);
    throw new Error(errorMsg || 'An error occurred with the server.');
  }

  return data;
};

export const api = {
  // Public APIs
  getCampuses: async () => {
    const res = await fetch(`${API_BASE}/public/campuses`);
    return handleResponse(res);
  },
  getBuildings: async (campusId) => {
    const res = await fetch(campusId ? `${API_BASE}/public/campuses/${campusId}/buildings` : `${API_BASE}/public/buildings`);
    return handleResponse(res);
  },
  getCategories: async () => {
    const res = await fetch(`${API_BASE}/public/categories`);
    return handleResponse(res);
  },

  // Auth APIs
  login: async (credentials) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(res);
  },
  register: async (studentData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });
    return handleResponse(res);
  },

  // Student APIs
  student: {
    getMyComplaints: async () => {
      const res = await fetch(`${API_BASE}/student/complaints/my`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    getComplaint: async (id) => {
      const res = await fetch(`${API_BASE}/student/complaints/${id}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    submitComplaint: async (data) => {
      const res = await fetch(`${API_BASE}/student/complaints`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    updatePendingComplaint: async (id, data) => {
      const res = await fetch(`${API_BASE}/student/complaints/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    submitFeedback: async (id, feedback) => {
      const res = await fetch(`${API_BASE}/student/complaints/${id}/feedback`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(feedback),
      });
      return handleResponse(res);
    },
    getProfile: async () => {
      const res = await fetch(`${API_BASE}/student/profile`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Admin APIs
  admin: {
    getComplaints: async (filters = {}) => {
      const params = new URLSearchParams();
      if (filters.campusId) params.append('campusId', filters.campusId);
      if (filters.buildingId) params.append('buildingId', filters.buildingId);
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);

      const qs = params.toString() ? `?${params.toString()}` : '';
      const res = await fetch(`${API_BASE}/admin/complaints${qs}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    getComplaint: async (id) => {
      const res = await fetch(`${API_BASE}/admin/complaints/${id}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    verifyComplaint: async (id, payload) => {
      const res = await fetch(`${API_BASE}/admin/complaints/${id}/verify`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },
    assignPersonnel: async (id, payload) => {
      const res = await fetch(`${API_BASE}/admin/complaints/${id}/assign`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },
    updateStatus: async (id, payload) => {
      const res = await fetch(`${API_BASE}/admin/complaints/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },
    resolveComplaint: async (id, payload) => {
      const res = await fetch(`${API_BASE}/admin/complaints/${id}/resolve`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },
    getDashboard: async (campusId) => {
      const qs = campusId ? `?campusId=${campusId}` : '';
      const res = await fetch(`${API_BASE}/admin/dashboard${qs}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    getReports: async (campusId) => {
      const qs = campusId ? `?campusId=${campusId}` : '';
      const res = await fetch(`${API_BASE}/admin/reports${qs}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    createBuilding: async (data) => {
      const res = await fetch(`${API_BASE}/admin/buildings`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
  },

  // AI APIs
  ai: {
    analyze: async (data) => {
      const res = await fetch(`${API_BASE}/ai/analyze`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    checkDuplicates: async (data) => {
      const res = await fetch(`${API_BASE}/ai/check-duplicates`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    chat: async (message) => {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ message }),
      });
      return handleResponse(res);
    },
  },

  // File Upload API
  upload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('cf_token');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/uploads`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return handleResponse(res);
  },
};
