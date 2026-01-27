import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainTabNavigator from "@/navigation/MainTabNavigator";
import SignInScreen from "@/screens/SignInScreen";
import SignUpScreen from "@/screens/SignUpScreen";
import WallOfFameScreen from "@/screens/WallOfFameScreen";
import WalletScreen from "@/screens/WalletScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  MainTabs: undefined;
  WallOfFame: undefined;
  Wallet: undefined;
  Champions: undefined;
  MyRealDream: undefined;
  Market: undefined;
  Gallery: undefined;
  NewsFeed: undefined;
  Connections: undefined;
  VendorProfile: undefined;
  Subscription: undefined;
  Notifications: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WallOfFame"
        component={WallOfFameScreen}
        options={{ headerTitle: "Wall of Fame" }}
      />
      <Stack.Screen
        name="Wallet"
        component={WalletScreen}
        options={{ headerTitle: "Wallet" }}
      />
    </Stack.Navigator>
  );
}
