// Import necessary Redux Toolkit functions
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of our authentication state
// This interface describes what data we'll store for auth
interface AuthState {
  isLoggedIn: boolean; // Flag to check if user is authenticated
  user: {
    // User information object (null when logged out)
    id: string;
    email: string;
    name: string;
  } | null;
  token: string | null; // JWT token for API requests (null when logged out)
}

// Initial state when app first loads
// isLoggedIn is false, no user data, no token
const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  token: null,
};

// Create the auth slice using Redux Toolkit
// A "slice" is a collection of Redux reducer logic and actions for a single feature
const authSlice = createSlice({
  name: 'auth', // Name of this slice (used in Redux DevTools)
  initialState, // The initial state defined above
  reducers: {
    // Action 1: login
    // Called when user successfully logs in
    // Payload contains user data and token from API response
    login: (
      state,
      action: PayloadAction<{ user: AuthState['user']; token: string }>
    ) => {
      state.isLoggedIn = true; // Set logged in flag to true
      state.user = action.payload.user; // Store user information
      state.token = action.payload.token; // Store authentication token
    },

    // Action 2: logout
    // Called when user logs out or session expires
    // Resets everything back to initial state
    logout: (state) => {
      state.isLoggedIn = false; // Set logged in flag to false
      state.user = null; // Clear user data
      state.token = null; // Clear authentication token
    },

    // Action 3: updateUser
    // Called when user updates their profile (name, email, etc.)
    // Only updates if user is already logged in
    updateUser: (
      state,
      action: PayloadAction<Partial<NonNullable<AuthState['user']>>>
    ) => {
      if (state.user) {
        // Merge existing user data with new data from payload
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

// Export actions so they can be dispatched from components
// Usage: dispatch(login({ user: {...}, token: '...' }))
export const { login, logout, updateUser } = authSlice.actions;

// Export reducer to be added to store configuration
export default authSlice.reducer;