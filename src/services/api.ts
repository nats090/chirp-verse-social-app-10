
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://chirp-verse-social-app-80.onrender.com';

// Auth token management
const getAuthToken = () => localStorage.getItem('authToken');
const setAuthToken = (token: string) => localStorage.setItem('authToken', token);
const removeAuthToken = () => localStorage.removeItem('authToken');

// API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
};

// Auth API
export const authAPI = {
  register: async (userData: { username: string; email: string; password: string }) => {
    const response = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    setAuthToken(response.token);
    return response;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    setAuthToken(response.token);
    return response;
  },

  logout: () => {
    removeAuthToken();
  },

  isAuthenticated: () => !!getAuthToken(),
};

// Posts API
export const postsAPI = {
  getAllPosts: () => apiRequest('/api/posts'),
  
  getUserPosts: (userId: string) => apiRequest(`/api/posts/user/${userId}`),
  
  createPost: (content: string) => apiRequest('/api/posts', {
    method: 'POST',
    body: JSON.stringify({ content }),
  }),

  updatePost: (postId: string, content: string) => apiRequest(`/api/posts/${postId}`, {
    method: 'PUT',
    body: JSON.stringify({ content }),
  }),

  deletePost: (postId: string) => apiRequest(`/api/posts/${postId}`, {
    method: 'DELETE',
  }),

  likePost: (postId: string) => apiRequest(`/api/posts/${postId}/like`, {
    method: 'PUT',
  }),

  addComment: (postId: string, content: string) => apiRequest(`/api/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  }),

  addReply: (postId: string, commentId: string, content: string) => apiRequest(`/api/posts/${postId}/comments/${commentId}/replies`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  }),

  getComments: (postId: string) => apiRequest(`/api/posts/${postId}/comments`),
};

// Users API
export const usersAPI = {
  getProfile: () => apiRequest('/api/users/profile'),
  
  getUserProfile: (userId: string) => apiRequest(`/api/users/profile/${userId}`),
  
  updateProfile: (profileData: { username: string; bio: string }) => apiRequest('/api/users/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),

  getUserPosts: () => apiRequest('/api/users/posts'),

  followUser: (userId: string) => apiRequest(`/api/users/follow/${userId}`, {
    method: 'PUT',
  }),

  getFollowStatus: (userId: string) => apiRequest(`/api/users/follow-status/${userId}`),

  getFollowing: () => apiRequest('/api/users/following'),

  getFollowers: () => apiRequest('/api/users/followers'),
};
