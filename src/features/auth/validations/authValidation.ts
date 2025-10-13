import * as Yup from "yup";

export const PersonalInfoSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .required("Full name is required"),
  phoneNumber: Yup.string()
    .min(5, "Phone number is too short")
    .required("Phone number is required"),
  city: Yup.string().required("Please select a city"),
  vehicleType: Yup.string().required("Please select a vehicle type"),
});

// Add more schemas for other steps
export const DocumentSubmissionSchema = Yup.object().shape({
  // Add document submission validation here
});

export const VehicleRequirementsSchema = Yup.object().shape({
  // Add vehicle requirements validation here
});