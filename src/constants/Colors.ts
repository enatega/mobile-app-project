// --- Light Theme Palette ---
export const lightColors = {
    GRADIENT_COLORS: ["#DAD5FB", "#fcfcfc"],
    background: '#FFFFFF',
    backgroundSecondary: '#F9FAFB',
    text: '#111827',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    primary: '#1691BF',
    primaryDark: '#0E7A9F',
    primaryLight: '#3DA9D1',
    success: '#10B981',
    successLight: '#D1FAE5',
    danger: '#EF4444',
    dangerLight: '#FEE2E2',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    card: '#FFFFFF',
    cardBorder: '#E5E7EB',
    shadow: '#000000',
  };
  
  // --- Dark Theme Palette ---
  export const darkColors = {
    GRADIENT_COLORS: ["#1F2937", "#111827"],
    background: '#111827',
    backgroundSecondary: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textTertiary: '#9CA3AF',
    primary: '#1691BF',
    primaryDark: '#0E7A9F',
    primaryLight: '#3DA9D1',
    success: '#10B981',
    successLight: '#065F46',
    danger: '#EF4444',
    dangerLight: '#7F1D1D',
    warning: '#F59E0B',
    warningLight: '#78350F',
    border: '#374151',
    borderLight: '#4B5563',
    card: '#1F2937',
    cardBorder: '#374151',
    shadow: '#000000',
  };
  
  // --- Common Colors Palette ---
  export const commonColors = {
    transparent: 'transparent',
    white: '#FFFFFF',
    black: '#000000',
    grey: '#888888',
    lightGrey: '#D3D3D3',
    darkGrey: '#555555',
    // Status colors
    online: '#10B981',
    offline: '#6B7280',
    pending: '#F59E0B',
    accepted: '#1691BF',
    completed: '#10B981',
    cancelled: '#EF4444',
  };
  
  // --- Export ---
  const Colors = {
    light: lightColors,
    dark: darkColors,
    common: commonColors,
  };
  
  export default Colors;
  