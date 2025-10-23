import ChatHeader from "@/src/components/common/Chat /ChatHeader";
import ChatInput from "@/src/components/common/Chat /ChatInput";
import ChatMessageList, { ChatMessage } from "@/src/components/common/Chat /ChatMessageList";
import GradientBackground from "@/src/components/common/GradientBackground";
import Button from "@/src/components/ui/Button ";
import CustomText from "@/src/components/ui/Text";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  StyleSheet,
  View,
} from "react-native";

const support = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      message: "How can we help you?\n[Automessage]",
      timestamp: "8:29 pm",
      isIncoming: true,
      showTimestamp: true,
    },
  ]);

  const [showQuickReplies, setShowQuickReplies] = useState(true);

  const quickReplies = [
    { id: "1", text: "I'm here" },
    { id: "2", text: "Hello" },
    { id: "3", text: "Call me when you arrive" },
    { id: "4", text: "Where are you?" },
    { id: "5", text: "How long will you take?" },
  ];

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
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      message: message,
      timestamp: "Now",
      isIncoming: false,
      showTimestamp: true,
    };
    setMessages((prev) => [...prev, newMessage]);
    setShowQuickReplies(false);
  };

  const handleQuickReply = (button: { id: string; text: string }) => {
    handleSendMessage(button.text);
  };

  const handleCameraPress = () => {
    Alert.alert("Camera", "Camera functionality will be implemented");
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#DAD5FB" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <CustomText>Something went wrong</CustomText>
        <Button
          title="Retry"
          variant="primary"
          onPress={() => setError(false)}
        />
      </View>
    );
  }

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
          onBackPress={handleBackPress}
          onPhonePress={handlePhonePress}
        />

        <ChatMessageList
          messages={messages}
          showQuickReplies={showQuickReplies}
          quickReplies={quickReplies}
          onQuickReply={handleQuickReply}
        />

        <View
          style={[
            styles.inputWrapper,
            {
              paddingBottom: isKeyboardVisible
                ? 0 // No padding when keyboard is visible
                : Platform.OS === "ios"
                ? 85 // iOS tab bar height
                : 60, // Android tab bar height
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
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  inputWrapper: {
    // Dynamic paddingBottom based on keyboard visibility
  },
});