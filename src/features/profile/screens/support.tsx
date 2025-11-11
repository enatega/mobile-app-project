// src/app/(tabs)/(rideRequests)/support.tsx
// FIXED VERSION - Messages now persist when app is closed and reopened

import ChatHeader from "@/src/components/common/Chat /ChatHeader";
import ChatInput from "@/src/components/common/Chat /ChatInput";
import ChatMessageList, { ChatMessage } from "@/src/components/common/Chat /ChatMessageList";
import GradientBackground from "@/src/components/common/GradientBackground";
import Button from "@/src/components/ui/Button ";
import CustomText from "@/src/components/ui/Text";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  StyleSheet,
  View,
} from "react-native";

import { useAppSelector } from "@/src/store/hooks";
import { selectUser } from "@/src/store/selectors/authSelectors";

import { useSendSupportMessage } from "../hooks/mutations/useSendSupportMessage";
import { useGetSupportMessages } from "../hooks/queries/useGetSupportMessages";
import { useInitializeSupportChat } from "../hooks/queries/useInitializeSupportChat";

import {
  convertWebSocketToSupportMessage,
  IReceivedMessage,
  SUPPORT_TEAM_ID,
  supportChatApi
} from "@/src/services/supportChatApi";

const support = () => {
  const router = useRouter();
  const { rideComplaint } = useLocalSearchParams();
  
  // Get driver ID from Redux store
  const currentUser = useAppSelector(selectUser);
  const driverId = currentUser?.id;
  
  // Parse ride complaint details if provided
  const rideComplaintDetails = rideComplaint ? JSON.parse(rideComplaint as string) : null;
  
  // Reset auto-send flag when ride complaint changes
  useEffect(() => {
    if (rideComplaintDetails) {
      setHasAutoSentRideDetails(false);
    }
  }, [rideComplaint]);

  // ============================================
  // STATE
  // ============================================
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [realtimeMessages, setRealtimeMessages] = useState<any[]>([]);
  const [chatBoxId, setChatBoxId] = useState<string | null>(null);
  const [hasAutoSentRideDetails, setHasAutoSentRideDetails] = useState(false);


  const flatListRef = useRef<FlatList>(null);

  // ============================================
  // TanStack Query Hooks
  // ============================================
  
  // 1️⃣ Initialize chat - finds existing chat or creates temp
  const {
    data: chatData,
    isLoading: isInitializing,
    error: initError,
    isSuccess: isChatInitialized,
  } = useInitializeSupportChat(driverId, { 
    enabled: !!driverId  // Always fetch when driverId exists
  });

  // 2️⃣ Fetch message history - ONLY runs when we have a REAL chatBoxId (not temp)
  // This is the key fix - it fetches persisted messages from backend
  const {
    data: historyMessages = [],
    isLoading: isLoadingMessages,
    refetch: refetchMessages,
  } = useGetSupportMessages(
    chatBoxId,
    // Enable when:
    // - Chat is initialized
    // - We have a chatBoxId
    // - ChatBoxId is NOT temp (real chats only)
    isChatInitialized && !!chatBoxId && !chatBoxId?.startsWith('temp-')
  );

  // 3️⃣ Send message mutation
  const {
    mutate: sendMessage,
    isPending: isSendingMessage,
  } = useSendSupportMessage();

  const quickReplies = rideComplaintDetails ? [
    { id: "1", text: "Passenger was rude or inappropriate" },
    { id: "2", text: "Passenger didn't show up" },
    { id: "3", text: "Wrong pickup/dropoff location" },
    { id: "4", text: "Payment issue with this ride" },
    { id: "5", text: "Safety concern during ride" },
  ] : [
    { id: "1", text: "I need help with a ride" },
    { id: "2", text: "Payment or fare issue" },
    { id: "3", text: "Technical problem with app" },
    { id: "4", text: "Account or profile issue" },
    { id: "5", text: "General inquiry" },
  ];

  // ============================================
  // Keyboard listeners
  // ============================================
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  // ============================================
  // CRITICAL FIX: Set chatBoxId and refetch messages when chat initializes
  // ============================================
  useEffect(() => {
    if (isChatInitialized && chatData?.chatBox) {
      const newChatBoxId = chatData.chatBox.id;
      
      console.log('✅ Support chat initialized');
      console.log('📦 Chat Box ID:', newChatBoxId);
      console.log('📦 Initial messages from init:', chatData.messages?.length || 0);
      console.log('🔍 Is temp chat?', newChatBoxId.startsWith('temp-'));
      
      setChatBoxId(newChatBoxId);

      // 🔥 KEY FIX: If this is a REAL chat (not temp), refetch messages
      // This ensures we get the latest messages from backend when app reopens
      if (!newChatBoxId.startsWith('temp-') && refetchMessages) {
        console.log('🔄 Refetching messages for real chat...');
        setTimeout(() => {
          refetchMessages();
        }, 500);
      }
    }
  }, [isChatInitialized, chatData]);

  // ============================================
  // WebSocket connection - Connect once when initialized
  // ============================================
  useEffect(() => {
    if (!driverId || !chatBoxId) {
      return;
    }

    console.log('🔌 Setting up WebSocket connection for driver:', driverId);

    const connectWebSocket = async () => {
      try {
        const isConnected = supportChatApi.isSocketConnected();
        
        if (!isConnected) {
          await supportChatApi.connectToSocket(driverId);
          console.log('✅ WebSocket connected for support chat');
        } else {
          console.log('✅ WebSocket already connected');
        }
      } catch (error) {
        console.error('❌ Failed to connect WebSocket:', error);
      }
    };

    connectWebSocket();

    const unsubscribeMessages = supportChatApi.onMessageReceived((wsMessage: IReceivedMessage) => {
      console.log('📥 Received WebSocket message:', wsMessage);

      const isRelevantMessage =
        (wsMessage.sender === SUPPORT_TEAM_ID && wsMessage.receiver === driverId) ||
        (wsMessage.sender === driverId && wsMessage.receiver === SUPPORT_TEAM_ID);

      if (isRelevantMessage) {
        console.log('✅ Message is for this support conversation');
        const chatMessage = convertWebSocketToSupportMessage(wsMessage, chatBoxId || undefined);

        setRealtimeMessages((prev) => {
          if (prev.some((msg) => msg.id === chatMessage.id)) {
            console.log('⚠️ Duplicate message, skipping');
            return prev;
          }
          
          return [...prev, chatMessage];
        });

        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    });

    return () => {
      console.log('🧹 Cleaning up WebSocket listeners');
      unsubscribeMessages();
    };
  }, [driverId, chatBoxId]);

  // ============================================
  // Combine all messages from ALL sources
  // This is where the magic happens - we merge:
  // 1. Initial messages from initialization
  // 2. Fetched messages from backend (historyMessages)
  // 3. Real-time messages from WebSocket
  // ============================================
  const allMessages = [
    ...(chatData?.messages || []),      // From initialization
    ...historyMessages,                  // 🔥 From fetch query (persisted messages)
    ...realtimeMessages,                 // From WebSocket
  ]
    .filter(
      (message, index, array) =>
        array.findIndex(
          (m) =>
            m.id === message.id ||
            (m.text === message.text &&
              m.senderId === message.senderId &&
              Math.abs(
                new Date(m.createdAt).getTime() -
                  new Date(message.createdAt).getTime()
              ) < 1000)
        ) === index
    )
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  console.log('📊 Message sources:', {
    fromInit: chatData?.messages?.length || 0,
    fromHistory: historyMessages.length,  // 🔥 This should have your old messages!
    fromRealtime: realtimeMessages.length,
    total: allMessages.length,
  });

  // ============================================
  // Auto-send ride complaint details when chat initializes
  // ============================================
  useEffect(() => {
    if (rideComplaintDetails && isChatInitialized && driverId && !hasAutoSentRideDetails) {
      const rideDetailsMessage = `RIDE COMPLAINT REFERENCE\n\n` +
        `Ride Reference: ${rideComplaintDetails.rideId}\n` +
        `Passenger Name: ${rideComplaintDetails.passengerName}\n` +
        `Contact Number: ${rideComplaintDetails.passengerPhone}\n\n` +
        `TRIP DETAILS:\n` +
        `Pickup Location: ${rideComplaintDetails.pickupAddress}\n` +
        `Destination: ${rideComplaintDetails.dropoffAddress}\n` +
        `Distance: ${rideComplaintDetails.distance} km\n` +
        `Estimated Fare: $${rideComplaintDetails.estimatedFare}\n\n` +
        `SERVICE INFORMATION:\n` +
        `Request Time: ${new Date(rideComplaintDetails.requestTime).toLocaleString()}\n` +
        `Service Type: ${rideComplaintDetails.rideType.charAt(0).toUpperCase() + rideComplaintDetails.rideType.slice(1)}\n` +
        `Payment Method: ${rideComplaintDetails.paymentMethod.charAt(0).toUpperCase() + rideComplaintDetails.paymentMethod.slice(1)}\n\n` +
        `I would like to file a complaint regarding this ride request. Please assist me with this matter.`;
      
      setTimeout(() => {
        handleSendMessage(rideDetailsMessage);
        setHasAutoSentRideDetails(true);
      }, 1000);
    }
  }, [rideComplaintDetails, isChatInitialized, driverId, hasAutoSentRideDetails]);

  // ============================================
  // Add auto-message if no messages exist
  // ============================================
  const messagesWithAutoMessage = allMessages.length === 0 && isChatInitialized
    ? [
        {
          id: 'auto-message-1',
          text: 'How can we help you?\n[Automessage]',
          senderId: SUPPORT_TEAM_ID,
          receiverId: driverId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          chatBoxId: chatBoxId || 'temp',
        },
      ]
    : allMessages;

  // Convert to UI format (ChatMessage interface)
  const messages: ChatMessage[] = messagesWithAutoMessage.map((msg) => ({
    id: msg.id,
    message: msg.text,
    timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    isIncoming: msg.senderId !== driverId,
    showTimestamp: true,
  }));

  // ============================================
  // Check if driver has sent any message (from ALL messages)
  // ============================================
  const hasDriverSentMessage = allMessages.some(
    (msg) => msg.senderId === driverId
  );

  console.log('🎯 Quick replies visible:', !hasDriverSentMessage);

  // ============================================
  // Auto-scroll on initial load
  // ============================================
  useEffect(() => {
    if (messages.length > 0 && !isLoadingMessages) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [messages.length, isLoadingMessages]);

  // ============================================
  // Handlers
  // ============================================
  const handleBackPress = () => {
    router.back();
  };

  const handlePhonePress = () => {
    const phoneNumber = "tel:+1234567890";
    Linking.openURL(phoneNumber).catch(() => {
      Alert.alert("Error", "Unable to make a call");
    });
  };

  const handleSendMessage = (message: string) => {
    if (!message.trim() || isSendingMessage || !driverId) return;

    console.log('📤 Sending support message:', message);

    sendMessage(
      {
        senderId: driverId,
        receiverId: SUPPORT_TEAM_ID,
        text: message.trim(),
      },
      {
        onSuccess: () => {
          console.log('✅ Support message sent successfully');

          // Scroll to bottom after sending
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);
        },
        onError: (error: any) => {
          console.error('❌ Send support message error:', error);
          Alert.alert('Error', 'Failed to send message to support. Please try again.');
        },
      }
    );
  };

  const handleQuickReply = (button: { id: string; text: string }) => {
    handleSendMessage(button.text);
  };

  const handleCameraPress = () => {
    Alert.alert("Camera", "Camera functionality will be implemented");
  };

  // ============================================
  // Error States
  // ============================================
  if (!driverId) {
    return (
      <View style={styles.centerContainer}>
        <CustomText>Driver ID not found. Please login again.</CustomText>
        <Button
          title="Go Back"
          variant="primary"
          onPress={() => router.back()}
        />
      </View>
    );
  }

  if (isInitializing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#DAD5FB" />
        <CustomText style={{ marginTop: 12 }}>Connecting to support...</CustomText>
      </View>
    );
  }

  if (initError) {
    return (
      <View style={styles.errorContainer}>
        <CustomText>Failed to connect to support</CustomText>
        <Button
          title="Retry"
          variant="primary"
          onPress={() => router.back()}
        />
      </View>
    );
  }

  // ============================================
  // Main UI
  // ============================================
  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
       <ChatHeader
  name="Support"
  showBackButton={true}
  showPhoneButton={false}
  showProfileImage={false}
  onBackPress={handleBackPress}
  onPhonePress={handlePhonePress}
/>

        <ChatMessageList
          messages={messages}
          showQuickReplies={!hasDriverSentMessage}
          quickReplies={quickReplies}
          onQuickReply={handleQuickReply}
        />

        <View
          style={[
            styles.inputWrapper,
            {
              paddingBottom: isKeyboardVisible
                ? 0
                : Platform.OS === "ios"
                ? 85
                : 60,
            },
          ]}
        >
          <ChatInput
            onSend={handleSendMessage}
            onCameraPress={handleCameraPress}
            placeholder="Enter your concern..."
          />
        </View>


      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

export default support;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    padding: 20,
  },
  inputWrapper: {
    // Dynamic paddingBottom based on keyboard visibility
  },

});