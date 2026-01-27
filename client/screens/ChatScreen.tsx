import { useState, useEffect, useRef } from "react";
import { View, StyleSheet, FlatList, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { RouteProp } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import { getApiUrl } from "@/lib/query-client";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type ChatScreenRouteProp = RouteProp<RootStackParamList, "Chat">;

type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
};

type ChatScreenProps = {
  route: ChatScreenRouteProp;
};

export default function ChatScreen({ route }: ChatScreenProps) {
  const { otherUserId, otherUserName } = route.params;
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        new URL(`/api/messages/${otherUserId}`, getApiUrl()).toString(),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [otherUserId]);

  const handleSend = async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const response = await fetch(new URL('/api/messages', getApiUrl()).toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: otherUserId,
          content: newMessage.trim(),
        }),
      });

      if (response.ok) {
        const message = await response.json();
        setMessages(prev => [...prev, message]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isMe = item.senderId === user?.id;
    return (
      <Animated.View
        entering={FadeInDown.delay(index * 30).springify()}
        style={[
          styles.messageContainer,
          isMe ? styles.myMessage : styles.theirMessage,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isMe
              ? { backgroundColor: theme.link }
              : { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          <ThemedText
            type="body"
            style={{ color: isMe ? "#FFFFFF" : theme.text }}
          >
            {item.content}
          </ThemedText>
          <ThemedText
            type="xs"
            style={[
              styles.messageTime,
              { color: isMe ? "rgba(255,255,255,0.7)" : theme.textMuted },
            ]}
          >
            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </ThemedText>
        </View>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <LinearGradient
        colors={[theme.link, theme.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.emptyIcon}
      >
        <Feather name="message-circle" size={32} color="#FFFFFF" />
      </LinearGradient>
      <ThemedText type="body" style={[styles.emptyText, { color: theme.textSecondary }]}>
        No messages yet
      </ThemedText>
      <ThemedText type="small" style={{ color: theme.textMuted }}>
        Start the conversation with {otherUserName}
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={headerHeight}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.link} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.messagesList,
              { paddingBottom: Spacing.lg },
              messages.length === 0 && styles.emptyList,
            ]}
            ListEmptyComponent={renderEmptyState}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            showsVerticalScrollIndicator={false}
          />
        )}

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: theme.backgroundDefault,
              paddingBottom: insets.bottom > 0 ? insets.bottom : Spacing.md,
              borderTopColor: theme.border,
            },
          ]}
        >
          <TextInput
            style={[
              styles.textInput,
              { backgroundColor: theme.backgroundSecondary, color: theme.text },
            ]}
            placeholder="Type a message..."
            placeholderTextColor={theme.textMuted}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={1000}
            testID="input-chat-message"
          />
          <Pressable
            onPress={handleSend}
            disabled={isSending || !newMessage.trim()}
            style={[
              styles.sendButton,
              { backgroundColor: newMessage.trim() ? theme.link : theme.backgroundSecondary },
            ]}
            testID="button-send-message"
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Feather
                name="send"
                size={20}
                color={newMessage.trim() ? "#FFFFFF" : theme.textMuted}
              />
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messagesList: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  emptyList: {
    flex: 1,
    justifyContent: "center",
  },
  emptyState: {
    alignItems: "center",
    gap: Spacing.md,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontWeight: "500",
  },
  messageContainer: {
    marginBottom: Spacing.sm,
    maxWidth: "80%",
  },
  myMessage: {
    alignSelf: "flex-end",
  },
  theirMessage: {
    alignSelf: "flex-start",
  },
  messageBubble: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  messageTime: {
    marginTop: Spacing.xs,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    gap: Spacing.sm,
  },
  textInput: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
});
