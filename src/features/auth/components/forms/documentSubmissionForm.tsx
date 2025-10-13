// src/components/forms/DocumentSubmissionForm.tsx
import Button from "@/src/components/ui/Button ";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import DocumentPicker from "react-native-document-picker";
import { launchImageLibrary } from "react-native-image-picker";
import FileUploadInput, { UploadedFile } from "../common/FileUploadInput";

export interface DocumentSubmissionFormValues {
  profilePicture: UploadedFile[];
  driverLicenseFront: UploadedFile[];
  driverLicenseBack: UploadedFile[];
  nationalIdFront: UploadedFile[];
  nationalIdBack: UploadedFile[];
  vehicleRegistrationFront: UploadedFile[];
  vehicleRegistrationBack: UploadedFile[];
  companyRegistration: UploadedFile[];
}

interface DocumentSubmissionFormProps {
  onSubmit: (values: DocumentSubmissionFormValues) => void;
  initialValues?: Partial<DocumentSubmissionFormValues>;
}

const DocumentSubmissionForm: React.FC<DocumentSubmissionFormProps> = ({
  onSubmit,
  initialValues,
}) => {
  const [profilePicture, setProfilePicture] = useState<UploadedFile[]>(
    initialValues?.profilePicture || []
  );
  const [driverLicenseFront, setDriverLicenseFront] = useState<UploadedFile[]>(
    initialValues?.driverLicenseFront || []
  );
  const [driverLicenseBack, setDriverLicenseBack] = useState<UploadedFile[]>(
    initialValues?.driverLicenseBack || []
  );
  const [nationalIdFront, setNationalIdFront] = useState<UploadedFile[]>(
    initialValues?.nationalIdFront || []
  );
  const [nationalIdBack, setNationalIdBack] = useState<UploadedFile[]>(
    initialValues?.nationalIdBack || []
  );
  const [vehicleRegistrationFront, setVehicleRegistrationFront] = useState<
    UploadedFile[]
  >(initialValues?.vehicleRegistrationFront || []);
  const [vehicleRegistrationBack, setVehicleRegistrationBack] = useState<
    UploadedFile[]
  >(initialValues?.vehicleRegistrationBack || []);
  const [companyRegistration, setCompanyRegistration] = useState<UploadedFile[]>(
    initialValues?.companyRegistration || []
  );

  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<Partial<Record<keyof DocumentSubmissionFormValues, string>>>({});

  // Helper function to create file object from image picker
  const makeImageObj = (image: any): UploadedFile => {
    return {
      uri: image?.uri || image?.path || image?.sourceURL,
      name:
        image?.fileName ||
        image?.filename ||
        image?.uri?.split("/").pop() ||
        "image.jpg",
      type: image?.type || image?.mime || "image/jpeg",
      size: image?.fileSize || image?.size,
    };
  };

  // Helper function to create file object from document picker
  const makeDocumentObj = (doc: any): UploadedFile => {
    return {
      uri: doc?.uri,
      name: doc?.name || "document.pdf",
      type: doc?.type || "application/pdf",
      size: doc?.size,
    };
  };

  // Simulate upload progress
  const simulateProgress = (callback: () => void) => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            callback();
            setUploading(null);
            setUploadProgress(0);
          }, 200);
          return 100;
        }
        return prev + 20;
      });
    }, 100);
  };

  // Image Picker Handler
  const handleImagePick = async (
    setter: React.Dispatch<React.SetStateAction<UploadedFile[]>>,
    field: string
  ) => {
    try {
      setUploading(field);

      const result = await launchImageLibrary({
        mediaType: "photo",
        quality: 0.8,
        selectionLimit: 1,
      });

      if (result.didCancel) {
        setUploading(null);
        return;
      }

      if (result.errorCode) {
        Alert.alert("Error", result.errorMessage || "Failed to pick image");
        setUploading(null);
        return;
      }

      if (result.assets && result.assets.length > 0) {
        simulateProgress(() => {
          const file = makeImageObj(result.assets![0]);
          setter([file]);
          setErrors((prev) => ({ ...prev, [field]: undefined }));
        });
      } else {
        setUploading(null);
      }
    } catch (error) {
      console.error("Image picker error:", error);
      setUploading(null);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  // Document Picker Handler
  const handleDocumentPick = async (
    setter: React.Dispatch<React.SetStateAction<UploadedFile[]>>,
    field: string
  ) => {
    try {
      setUploading(field);

      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
        allowMultiSelection: false,
      });

      simulateProgress(() => {
        const file = makeDocumentObj(result[0]);
        setter([file]);
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      });
    } catch (err) {
      setUploading(null);
      if (!DocumentPicker.isCancel(err)) {
        console.error("Document picker error:", err);
        Alert.alert("Error", "Failed to pick document");
      }
    }
  };

  // Remove File Handler
  const handleRemoveFile = (
    setter: React.Dispatch<React.SetStateAction<UploadedFile[]>>,
    index: number
  ) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  // Validation
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof DocumentSubmissionFormValues, string>> = {};

    if (profilePicture.length === 0) {
      newErrors.profilePicture = "Profile picture is required";
    }
    if (driverLicenseFront.length === 0) {
      newErrors.driverLicenseFront = "Driver's license front is required";
    }
    if (driverLicenseBack.length === 0) {
      newErrors.driverLicenseBack = "Driver's license back is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = () => {
    console.log("🔘 Submit button clicked!");

    if (!validate()) {
      Alert.alert("Validation Error", "Please upload all required documents");
      return;
    }

    const values: DocumentSubmissionFormValues = {
      profilePicture,
      driverLicenseFront,
      driverLicenseBack,
      nationalIdFront,
      nationalIdBack,
      vehicleRegistrationFront,
      vehicleRegistrationBack,
      companyRegistration,
    };

    console.log("✅ Form values:", values);
    onSubmit(values);
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Document Submission</Text>

        {/* Profile Picture */}
        <FileUploadInput
          label="Profile Picture"
          placeholder="Muhammad Umair.jpeg"
          files={profilePicture}
          onUpload={() => handleImagePick(setProfilePicture, "profilePicture")}
          onRemove={(index: number) => handleRemoveFile(setProfilePicture, index)}
          error={errors.profilePicture}
          uploading={uploading === "profilePicture"}
          uploadProgress={uploadProgress}
        />

        {/* Driver's License (Front & Back) */}
        <FileUploadInput
          label="Driver's License (Front & Back)"
          placeholder="Driving-license.pdf"
          files={[...driverLicenseFront, ...driverLicenseBack]}
          onUpload={() => {
            if (driverLicenseFront.length === 0) {
              handleDocumentPick(setDriverLicenseFront, "driverLicenseFront");
            } else {
              handleDocumentPick(setDriverLicenseBack, "driverLicenseBack");
            }
          }}
          onRemove={(index: number) => {
            if (index < driverLicenseFront.length) {
              handleRemoveFile(setDriverLicenseFront, index);
            } else {
              handleRemoveFile(
                setDriverLicenseBack,
                index - driverLicenseFront.length
              );
            }
          }}
          error={errors.driverLicenseFront || errors.driverLicenseBack}
          maxFiles={2}
          uploading={
            uploading === "driverLicenseFront" ||
            uploading === "driverLicenseBack"
          }
          uploadProgress={uploadProgress}
          helperText="valid & not expired"
        />

        {/* National ID / Passport (Front & Back) */}
        <FileUploadInput
          label="National ID / Passport (Front & Back)"
          placeholder="JPG, PNG, PDF, Max. Size 5mb"
          files={[...nationalIdFront, ...nationalIdBack]}
          onUpload={() => {
            if (nationalIdFront.length === 0) {
              handleDocumentPick(setNationalIdFront, "nationalIdFront");
            } else {
              handleDocumentPick(setNationalIdBack, "nationalIdBack");
            }
          }}
          onRemove={(index: number) => {
            if (index < nationalIdFront.length) {
              handleRemoveFile(setNationalIdFront, index);
            } else {
              handleRemoveFile(
                setNationalIdBack,
                index - nationalIdFront.length
              );
            }
          }}
          maxFiles={2}
          uploading={
            uploading === "nationalIdFront" || uploading === "nationalIdBack"
          }
          uploadProgress={uploadProgress}
          helperText="valid & not expired"
        />

        {/* Vehicle Registration (Front & Back) */}
        <FileUploadInput
          label="Vehicle Registration (Front & Back)"
          placeholder="JPG, PNG, PDF, Max. Size 5mb"
          files={[...vehicleRegistrationFront, ...vehicleRegistrationBack]}
          onUpload={() => {
            if (vehicleRegistrationFront.length === 0) {
              handleDocumentPick(
                setVehicleRegistrationFront,
                "vehicleRegistrationFront"
              );
            } else {
              handleDocumentPick(
                setVehicleRegistrationBack,
                "vehicleRegistrationBack"
              );
            }
          }}
          onRemove={(index: number) => {
            if (index < vehicleRegistrationFront.length) {
              handleRemoveFile(setVehicleRegistrationFront, index);
            } else {
              handleRemoveFile(
                setVehicleRegistrationBack,
                index - vehicleRegistrationFront.length
              );
            }
          }}
          maxFiles={2}
          uploading={
            uploading === "vehicleRegistrationFront" ||
            uploading === "vehicleRegistrationBack"
          }
          uploadProgress={uploadProgress}
          helperText="Estimara"
        />

        {/* Company Commercial Registration */}
        <FileUploadInput
          label="Company Commercial Registration"
          placeholder="JPG, PNG, PDF, Max. Size 5mb"
          files={companyRegistration}
          onUpload={() =>
            handleDocumentPick(setCompanyRegistration, "companyRegistration")
          }
          onRemove={(index: number) =>
            handleRemoveFile(setCompanyRegistration, index)
          }
          uploading={uploading === "companyRegistration"}
          uploadProgress={uploadProgress}
        />

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Save & Next"
            onPress={handleSubmit}
            variant="primary"
            size="large"
            fullWidth
            style={styles.submitButton}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default DocumentSubmissionForm;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  formContainer: {
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#3853A4",
    height: 56,
  },
});