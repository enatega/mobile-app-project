// --- Light Theme Palette ---
export const lightColors = {
  // Backgrounds
  BACKGROUND: '#FFFFFF',
  
  // Brand Colors
  PRIMARY: '#3853A4', // Main brand blue
  
  // Text Colors
  TEXT_PRIMARY: '#1F2937',
  TEXT_SECONDARY: '#6B7280',
  
  // Gradients
  GRADIENT_COLORS: ["#DAD5FB", "#fcfcfc"],
};

// --- Dark Theme Palette ---
export const darkColors = {
  // Backgrounds
  BACKGROUND: '#1F2937',
  
  // Brand Colors
  PRIMARY: '#3853A4', // Same blue in dark mode
  
  // Text Colors
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#9CA3AF',
  
  // Gradients
  GRADIENT_COLORS: ["#DAD5FB", "#fcfcfc"]
};

// --- Common Colors Palette ---
export const commonColors = {
  transparent: 'transparent',
  grey: '#888888',
  lightGrey: '#D3D3D3',
  darkGrey: '#555555',
};

// --- Export ---
const Colors = {
  light: lightColors,
  dark: darkColors,
  common: commonColors,
};

export default Colors;