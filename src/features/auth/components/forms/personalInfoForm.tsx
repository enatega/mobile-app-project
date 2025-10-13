import Button from "@/src/components/ui/Button ";
import CustomInput from "@/src/components/ui/Input";
import CustomDropdown from "@/src/components/ui/dropdown";
import { useAppSelector } from "@/src/store/hooks";
import { selectPersonalInfo } from "@/src/store/selectors/signup.selectors";
import { Formik, FormikHelpers } from "formik";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import PhoneInput, { ICountry } from "react-native-international-phone-number";
import { PersonalInfoFormValues } from "../../types";
import { PersonalInfoSchema } from "../../validations/authValidation";

interface PersonalInfoFormProps {
  onSubmit: (values: PersonalInfoFormValues) => void;
  initialValues?: PersonalInfoFormValues;
}

const cities = [
  { label: "Berlin", value: "berlin" },
  { label: "Munich", value: "munich" },
  { label: "Hamburg", value: "hamburg" },
  { label: "Frankfurt", value: "frankfurt" },
  { label: "Cologne", value: "cologne" },
];

const vehicleTypes = [
  { label: "Sedan", value: "sedan" },
  { label: "SUV", value: "suv" },
  { label: "Hatchback", value: "hatchback" },
  { label: "Truck", value: "truck" },
  { label: "Van", value: "van" },
];

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  onSubmit,
  initialValues,
}) => {
  // Get saved data from Redux store
  const savedPersonalInfo = useAppSelector(selectPersonalInfo);
  
  // Use saved data from Redux if available, otherwise use prop initialValues or empty defaults
  const formInitialValues: PersonalInfoFormValues = initialValues || savedPersonalInfo || {
    fullName: "",
    phoneNumber: "",
    city: "",
    vehicleType: "",
  };

  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
  const [openDropdown, setOpenDropdown] = useState<'city' | 'vehicleType' | null>(null);

  const handleSubmit = (
    values: PersonalInfoFormValues,
    formikHelpers: FormikHelpers<PersonalInfoFormValues>
  ) => {
    console.log("🚀 Form submitted with values:", values);
    onSubmit(values);
    formikHelpers.setSubmitting(false);
  };

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={PersonalInfoSchema}
      onSubmit={handleSubmit}
      enableReinitialize={true}
      validateOnChange={true}
      validateOnBlur={true}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        setFieldValue,
        setFieldTouched,
        handleSubmit: formikSubmit,
        isSubmitting,
        isValid,
      }) => {
        // Debug log
        console.log("📝 Form values:", values);
        console.log("❌ Form errors:", errors);
        console.log("✅ Form is valid:", isValid);
        
        return (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>Personal Information</Text>

              {/* Full Name Input */}
              <CustomInput
                label="Full Name"
                placeholder="Muhammad Umair"
                value={values.fullName}
                onChangeText={handleChange("fullName")}
                onBlur={() => setFieldTouched("fullName")}
                error={touched.fullName ? errors.fullName : undefined}
                variant="outline"
                size="large"
                containerStyle={styles.inputContainer}
              />

              {/* Phone Number Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <PhoneInput
                  value={values.phoneNumber}
                  onChangePhoneNumber={(phoneNumber) => {
                    console.log("📞 Phone changed:", phoneNumber);
                    setFieldValue("phoneNumber", phoneNumber);
                  }}
                  selectedCountry={selectedCountry}
                  onChangeSelectedCountry={(country) => {
                    setSelectedCountry(country);
                  }}
                  placeholder="Phone number"
                  defaultCountry="DE"
                  phoneInputStyles={{
                    container: styles.phoneContainer,
                    flagContainer: styles.flagContainer,
                    flag: {},
                    caret: styles.caret,
                    divider: styles.divider,
                    callingCode: styles.callingCode,
                    input: styles.phoneInput,
                  }}
                  modalStyles={{
                    backdrop: {},
                    countryName: styles.countryName,
                    searchInput: styles.searchInput,
                  }}
                />
                {touched.phoneNumber && errors.phoneNumber && (
                  <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                )}
              </View>

              {/* City Dropdown */}
              <View style={[styles.dropdownWrapper, { zIndex: openDropdown === 'city' ? 2000 : 1 }]}>
                <CustomDropdown
                  label="City"
                  placeholder="City"
                  value={values.city}
                  items={cities}
                  onChange={(value) => {
                    console.log("🏙️ City changed:", value);
                    setFieldValue("city", value);
                  }}
                  onBlur={() => setFieldTouched("city")}
                  error={touched.city ? errors.city : undefined}
                  variant="outline"
                  size="large"
                  open={openDropdown === 'city'}
                  setOpen={(isOpen) => setOpenDropdown(isOpen ? 'city' : null)}
                />
              </View>

              {/* Vehicle Type Dropdown */}
              <View style={[styles.dropdownWrapper, { zIndex: openDropdown === 'vehicleType' ? 2000 : 1 }]}>
                <CustomDropdown
                  label="Vehicle Type"
                  placeholder="Vehicle Type"
                  value={values.vehicleType}
                  items={vehicleTypes}
                  onChange={(value) => {
                    console.log("🚗 Vehicle changed:", value);
                    setFieldValue("vehicleType", value);
                  }}
                  onBlur={() => setFieldTouched("vehicleType")}
                  error={touched.vehicleType ? errors.vehicleType : undefined}
                  variant="outline"
                  size="large"
                  open={openDropdown === 'vehicleType'}
                  setOpen={(isOpen) => setOpenDropdown(isOpen ? 'vehicleType' : null)}
                />
              </View>

              {/* Submit Button */}
              <View style={styles.buttonContainer}>
                <Button
                  title="Save & Next"
                  onPress={() => {
                    console.log("🔘 Button clicked!");
                    console.log("Form is valid?", isValid);
                    console.log("Current errors:", errors);
                    formikSubmit();
                  }}
                  variant="primary"
                  size="large"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  fullWidth
                  style={styles.submitButton}
                />
              </View>
            </View>
          </ScrollView>
        );
      }}
    </Formik>
  );
};

export default PersonalInfoForm;

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
  inputContainer: {
    marginBottom: 20,
  },
  dropdownWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#374151",
  },
  // Phone Input Styles
  phoneContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    height: 52,
  },
  flagContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  caret: {
    color: "#6B7280",
    fontSize: 16,
  },
  divider: {
    backgroundColor: "#E5E7EB",
  },
  callingCode: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  phoneInput: {
    fontSize: 16,
    color: "#111827",
    flex: 1,
  },
  countryName: {
    color: "#111827",
  },
  searchInput: {
    borderColor: "#D1D5DB",
  },
  errorText: {
    fontSize: 12,
    color: "#DC3545",
    marginTop: 4,
  },
  // Submit Button
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#3853A4",
    height: 56,
  },
});