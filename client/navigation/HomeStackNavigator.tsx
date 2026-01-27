import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainMenuScreen from "@/screens/MainMenuScreen";
import ChampionsScreen from "@/screens/ChampionsScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type HomeStackParamList = {
  Home: undefined;
  Champions: undefined;
  Market: undefined;
  Gallery: undefined;
  NewsFeed: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Home"
        component={MainMenuScreen}
        options={{
          headerTitle: () => <HeaderTitle title="Real Dream" />,
        }}
      />
      <Stack.Screen
        name="Champions"
        component={ChampionsScreen}
        options={{
          headerTitle: "CHAMPIONS",
        }}
      />
    </Stack.Navigator>
  );
}
