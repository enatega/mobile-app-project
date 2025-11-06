export const API_CONFIG = {
    BASE_URL: 'http://192.168.18.88:3000',
    ENDPOINTS: {
      GET_TOKEN: '/test/twilio/token',
      VOICE_WEBHOOK: '/test/twilio/voice'
    }
  } as const;
  // User identities - these will be unique for each user
  // In production, these would come from your auth system
  export const USER_IDENTITIES = {
    CUSTOMER: 'customer_',
    DRIVER: 'driver_'
  } as const;
  // Types
  export type UserRole = 'customer' | 'driver';