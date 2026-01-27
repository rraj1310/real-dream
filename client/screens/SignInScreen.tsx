import { useState } from "react";
import { View, StyleSheet, Pressable, Image, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type SignInScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "SignIn">;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function SignInScreen({ navigation }: SignInScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { login, loginWithGoogle, loginWithFacebook } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);
  const [error, setError] = useState("");

  const logoScale = useSharedValue(1);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please enter your email and password");
      return;
    }
    
    setIsLoading(true);
    setError("");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const result = await login(email.trim().toLowerCase(), password);
    setIsLoading(false);
    
    if (result.success) {
      navigation.replace("MainTabs");
    } else {
      setError(result.error || "Login failed");
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError("");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const result = await loginWithGoogle();
      setIsGoogleLoading(false);
      
      if (result.success) {
        navigation.replace("MainTabs");
      } else {
        setError(result.error || "Google login failed");
      }
    } catch (err) {
      setIsGoogleLoading(false);
      setError("Google login failed");
    }
  };

  const handleFacebookSignIn = async () => {
    setIsFacebookLoading(true);
    setError("");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const result = await loginWithFacebook();
      setIsFacebookLoading(false);
      
      if (result.success) {
        navigation.replace("MainTabs");
      } else {
        setError(result.error || "Facebook login failed");
      }
    } catch (err) {
      setIsFacebookLoading(false);
      setError("Facebook login failed");
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword" as any);
  };

  const handleLogoPress = () => {
    logoScale.value = withSpring(0.95, { damping: 15 });
    setTimeout(() => {
      logoScale.value = withSpring(1, { damping: 15 });
    }, 100);
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + Spacing["3xl"],
          paddingBottom: insets.bottom + Spacing.xl,
          backgroundColor: Colors.light.blue,
        },
      ]}
    >
      <View style={styles.gradientOverlay} />

      <View style={styles.content}>
        <AnimatedPressable
          onPress={handleLogoPress}
          style={[styles.logoContainer, logoAnimatedStyle]}
        >
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </AnimatedPressable>

        <ThemedText
          type="h1"
          style={[styles.title, { color: "#FFFFFF" }]}
        >
          Real Dream
        </ThemedText>
        <ThemedText
          type="body"
          style={[styles.subtitle, { color: "rgba(255,255,255,0.8)" }]}
        >
          Sign in to your account
        </ThemedText>

        <View
          style={[
            styles.formContainer,
            { backgroundColor: theme.backgroundDefault },
          ]}
        >
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            testID="input-email"
          />

          <View style={styles.passwordContainer}>
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              testID="input-password"
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
              testID="button-toggle-password"
            >
              <Feather
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color={theme.textMuted}
              />
            </Pressable>
          </View>

          <Pressable style={styles.forgotButton} onPress={handleForgotPassword}>
            <ThemedText type="small" style={{ color: theme.link }}>
              Forgot Password?
            </ThemedText>
          </Pressable>

          {error ? (
            <ThemedText type="small" style={styles.errorText}>
              {error}
            </ThemedText>
          ) : null}

          <Button onPress={handleSignIn} disabled={isLoading} testID="button-signin">
            {isLoading ? <ActivityIndicator color="#FFFFFF" size="small" /> : "Sign In"}
          </Button>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            <ThemedText type="small" style={{ color: theme.textMuted, paddingHorizontal: Spacing.md }}>
              or continue with
            </ThemedText>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          </View>

          <View style={styles.socialButtons}>
            <Pressable
              onPress={handleGoogleSignIn}
              style={[styles.socialButton, { backgroundColor: theme.backgroundSecondary }]}
              disabled={isGoogleLoading}
              testID="button-google-signin"
            >
              {isGoogleLoading ? (
                <ActivityIndicator color={theme.text} size="small" />
              ) : (
                <>
                  <Feather name="mail" size={20} color="#EA4335" />
                  <ThemedText type="small" style={{ color: theme.text, marginLeft: Spacing.sm }}>
                    Google
                  </ThemedText>
                </>
              )}
            </Pressable>

            <Pressable
              onPress={handleFacebookSignIn}
              style={[styles.socialButton, { backgroundColor: theme.backgroundSecondary }]}
              disabled={isFacebookLoading}
              testID="button-facebook-signin"
            >
              {isFacebookLoading ? (
                <ActivityIndicator color={theme.text} size="small" />
              ) : (
                <>
                  <Feather name="facebook" size={20} color="#1877F2" />
                  <ThemedText type="small" style={{ color: theme.text, marginLeft: Spacing.sm }}>
                    Facebook
                  </ThemedText>
                </>
              )}
            </Pressable>
          </View>

          <View style={styles.signUpContainer}>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Don't have an account?{" "}
            </ThemedText>
            <Pressable onPress={() => navigation.navigate("SignUp")}>
              <ThemedText
                type="small"
                style={{ color: theme.link, fontWeight: "600" }}
              >
                Sign Up
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    alignItems: "center",
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    marginBottom: Spacing.lg,
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  title: {
    marginBottom: Spacing.xs,
  },
  subtitle: {
    marginBottom: Spacing["3xl"],
  },
  formContainer: {
    width: "100%",
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  passwordContainer: {
    position: "relative",
  },
  eyeButton: {
    position: "absolute",
    right: Spacing.lg,
    top: 38,
    padding: Spacing.xs,
  },
  forgotButton: {
    alignSelf: "flex-start",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  socialButtons: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing.sm,
  },
  errorText: {
    color: "#EF4444",
    textAlign: "center",
  },
});
