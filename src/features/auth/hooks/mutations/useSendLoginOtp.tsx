// src/features/auth/hooks/mutations/useSendLoginOtp.ts
import { API_ENDPOINTS, apiClient } from '@/src/lib/axios';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';

export interface SendLoginOtpRequest {
  phone: string;
  otp_type: 'sms' | 'call';
}

interface SendLoginOtpResponse {
  message?: string;  // Made optional since it's not in your API response
  userId: string;
}

export const useSendLoginOtp = () => {
  return useMutation({
    mutationFn: async (data: SendLoginOtpRequest) => {
      console.log('📤 Sending login OTP:', { ...data });
      
      const response = await apiClient.post<SendLoginOtpResponse>(
        API_ENDPOINTS.AUTH.LOGIN_SEND_OTP,
        data
      );
      console.log("🚀 ~ useSendLoginOtp ~ response:", response.data)
      
      return response.data;
    },
    onSuccess: (data, variables) => {
      console.log('✅ Login OTP sent successfully');
      console.log('📝 User ID:', data?.userId);  // Updated to flat access
      console.log('📱 Phone:', variables.phone);
      
      // Navigate with flat userId access
      router.push({
        pathname: '/(auth)/verifyOtpLogin',
        params: {
          userId: data.userId,  // Fixed: No nested 'data'
          phone: variables.phone,
        }
      });
    },
    onError: (error: any) => {
      console.error('❌ Failed to send login OTP:', error);
    },
  });
};