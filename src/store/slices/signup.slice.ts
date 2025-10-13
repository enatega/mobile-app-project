// src/store/slices/signup.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the complete signup state interface for all 3 stages
interface SignupState {
  // Stage 1: Personal Information
  personalInfo: {
    fullName: string;
    phoneNumber: string;
    city: string;
    vehicleType: string;
  };
  
  // Stage 2: Document Submission (add fields as needed)
  documentSubmission: {
    drivingLicense?: string;
    identityCard?: string;
    vehicleRegistration?: string;
    // Add more document fields here
  };
  
  // Stage 3: Vehicle Requirements (add fields as needed)
  vehicleRequirements: {
    vehicleModel?: string;
    vehicleYear?: string;
    vehiclePlateNumber?: string;
    vehicleColor?: string;
    // Add more vehicle fields here
  };
  
  // Track completion only
  isComplete: boolean;
}

// Initial state
const initialState: SignupState = {
  personalInfo: {
    fullName: '',
    phoneNumber: '',
    city: '',
    vehicleType: '',
  },
  documentSubmission: {},
  vehicleRequirements: {},
  isComplete: false,
};

// Create the signup slice
const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    // Save Stage 1: Personal Info
    setPersonalInfo: (state, action: PayloadAction<SignupState['personalInfo']>) => {
      state.personalInfo = action.payload;
    },
    
    // Save Stage 2: Document Submission
    setDocumentSubmission: (state, action: PayloadAction<SignupState['documentSubmission']>) => {
      state.documentSubmission = action.payload;
    },
    
    // Save Stage 3: Vehicle Requirements
    setVehicleRequirements: (state, action: PayloadAction<SignupState['vehicleRequirements']>) => {
      state.vehicleRequirements = action.payload;
      state.isComplete = true;
    },
    
    // Reset all signup data (useful after successful submission or logout)
    resetSignup: (state) => {
      state.personalInfo = initialState.personalInfo;
      state.documentSubmission = initialState.documentSubmission;
      state.vehicleRequirements = initialState.vehicleRequirements;
      state.isComplete = false;
    },
  },
});

// Export actions
export const {
  setPersonalInfo,
  setDocumentSubmission,
  setVehicleRequirements,
  resetSignup,
} = signupSlice.actions;

// Export reducer
export default signupSlice.reducer;