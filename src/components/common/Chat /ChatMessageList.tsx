import React, { useEffect, useRef } from "react";
import {
    Keyboard,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import MessageBubble from "./MessageBubble";

export interface ChatMessage {
  id: string;
  message: string;
  timestamp: string;
  isIncoming: boolean;
  showTimestamp?: boolean;
}

interface ChatMessageListProps {
  messages: ChatMessage[];
  onScroll?: () => void;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  onScroll,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.messagesContainer}>
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message.message}
              timestamp={message.timestamp}
              isIncoming={message.isIncoming}
              showTimestamp={message.showTimestamp ?? true}
            />
          ))}
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default ChatMessageList;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  messagesContainer: {
    gap: 8,
  },
});