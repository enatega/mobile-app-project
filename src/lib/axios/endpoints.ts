export const API_ENDPOINTS = {

  profile: {
    user: "/api/v1/users",
    updatePassword: "/api/v1/users/password",
  },

  LUMI_RIDER_AUTH: {
    SIGNUP_SEND_OTP: '/api/v1/auth/lumi/rider/signup/first-step',

    SIGNUP_VERIFY_OTP: '/api/v1/auth/lumi/rider/signup/final-step',

    ONBOARDING: '/api/v1/auth/lumi/rider/onboarding',
  },

  AUTH: {
    // Login Step 1: Send OTP
    LOGIN_SEND_OTP: '/api/v1/auth/login/phone/send',
    
    // Login Step 2: Verify OTP
    LOGIN_VERIFY_OTP: '/api/v1/auth/login/phone/verify',
    
    // Logout
    LOGOUT: '/api/v1/auth/logout',
    
    // Refresh Token
    REFRESH_TOKEN: '/api/v1/auth/refresh',
  },

  // ============================================
  // USER PROFILE
  // ============================================
  USER: {
    // Get current user profile
    PROFILE: '/api/v1/users/profile',
    
    // Update user profile
    UPDATE_PROFILE: '/api/v1/users/profile',
    
    // Get user by ID
    GET_USER: (userId: string) => `/api/v1/users/${userId}`,
  },

  // ============================================
  // RIDER
  // ============================================
  RIDER: {
    // Get rider profile
    PROFILE: '/api/v1/riders/profile',
    
    // Update rider availability
    UPDATE_AVAILABILITY: '/api/v1/riders/availability',
    
    // Get rider stats
    STATS: '/api/v1/riders/stats',
    
    // Update rider location
    UPDATE_LOCATION: '/api/v1/riders/location',
  },

  // ============================================
  // RIDE REQUESTS
  // ============================================
  RIDE_REQUESTS: {
    // Get available ride requests
    AVAILABLE: '/api/v1/ride-requests/available',
    
    // Get ride request by ID
    GET_BY_ID: (requestId: string) => `/api/v1/ride-requests/${requestId}`,
    
    // Accept ride request
    ACCEPT: (requestId: string) => `/api/v1/ride-requests/${requestId}/accept`,
    
    // Reject ride request
    REJECT: (requestId: string) => `/api/v1/ride-requests/${requestId}/reject`,
    
    // Complete ride
    COMPLETE: (requestId: string) => `/api/v1/ride-requests/${requestId}/complete`,
    
    // Cancel ride
    CANCEL: (requestId: string) => `/api/v1/ride-requests/${requestId}/cancel`,
    
    // Get ride history
    HISTORY: '/api/v1/ride-requests/history',
  },

  // ============================================
  // RIDES (Active Rides)
  // ============================================
  RIDES: {
    // Get active rides
    ACTIVE: '/api/v1/rides/active',
    
    // Get ride by ID
    GET_BY_ID: (rideId: string) => `/api/v1/rides/${rideId}`,
    
    // Start ride
    START: (rideId: string) => `/api/v1/rides/${rideId}/start`,
    
    // End ride
    END: (rideId: string) => `/api/v1/rides/${rideId}/end`,
    
    // Update ride status
    UPDATE_STATUS: (rideId: string) => `/api/v1/rides/${rideId}/status`,
  },

  // ============================================
  // ORDERS (if applicable)
  // ============================================
  ORDERS: {
    // Get orders list
    LIST: '/api/v1/orders',
    
    // Get order by ID
    GET_BY_ID: (orderId: string) => `/api/v1/orders/${orderId}`,
    
    // Update order status
    UPDATE_STATUS: (orderId: string) => `/api/v1/orders/${orderId}/status`,
  },

  // ============================================
  // INVENTORY (if applicable)
  // ============================================
  INVENTORY: {
    // Get inventory list
    LIST: '/api/v1/inventory',
    
    // Get inventory by ID
    GET_BY_ID: (itemId: string) => `/api/v1/inventory/${itemId}`,
  },

  // ============================================
  // NOTIFICATIONS
  // ============================================
  NOTIFICATIONS: {
    // Get notifications
    LIST: '/api/v1/notifications',
    
    // Mark as read
    MARK_READ: (notificationId: string) => `/api/v1/notifications/${notificationId}/read`,
    
    // Mark all as read
    MARK_ALL_READ: '/api/v1/notifications/read-all',
  },

  // ============================================
  // RIDE TYPES
  // ============================================
  RIDE_TYPES: {
    // Get all ride types
    LIST: '/api/v1/ride-types',
    
    // Get ride type by ID
    GET_BY_ID: (rideTypeId: string) => `/api/v1/ride-types/${rideTypeId}`,
  },

  // ============================================
  // FILE UPLOAD
  // ============================================
  UPLOAD: {
    // Upload single file
    SINGLE: '/api/v1/upload/single',
    
    // Upload multiple files
    MULTIPLE: '/api/v1/upload/multiple',
  },
};

// ============================================
// USAGE EXAMPLES
// ============================================
/*

// 1. Simple endpoint usage
const response = await apiClient.post(API_ENDPOINTS.LUMI_RIDER_AUTH.SIGNUP_SEND_OTP, {
  phone: "+966501234567",
  otp_type: "sms"
});

// 2. Dynamic endpoint with parameter
const rideId = "123-456-789";
const response = await apiClient.get(API_ENDPOINTS.RIDES.GET_BY_ID(rideId));

// 3. Login flow
const loginResponse = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN_SEND_OTP, {
  phone: "+966501234567",
  opt_type: "message",
  login_as: "Rider"
});

// 4. Get rider profile (token added automatically)
const profile = await apiClient.get(API_ENDPOINTS.RIDER.PROFILE);

*/