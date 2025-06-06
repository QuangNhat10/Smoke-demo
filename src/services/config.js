const API_BASE_URL = 'http://localhost:3001';  // Replace with your actual API base URL

export const API_ENDPOINTS = {
    // Auth endpoints
    LOGIN: `${API_BASE_URL}/users/login`,
    REGISTER: `${API_BASE_URL}/users`,
    
    // User endpoints
    USER_PROFILE: `${API_BASE_URL}/users/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/users/profile`,
    
    // Appointment endpoints
    APPOINTMENTS: `${API_BASE_URL}/appointments`,
    
    // Blog endpoints
    BLOG_POSTS: `${API_BASE_URL}/blog-posts`,
    
    // Doctor endpoints
    DOCTORS: `${API_BASE_URL}/doctors`,
    
    // Membership endpoints
    MEMBERSHIP_PLANS: `${API_BASE_URL}/membership-plans`,
    
    // Tracking endpoints
    SMOKING_STATUS: `${API_BASE_URL}/tracking/status`,
    
    // Support endpoints
    SUPPORT_MESSAGES: `${API_BASE_URL}/support/messages`,
}
