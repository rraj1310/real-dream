import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainMenuScreen from "@/screens/MainMenuScreen";
import ChampionsScreen from "@/screens/ChampionsScreen";
import WallOfFameScreen from "@/screens/WallOfFameScreen";
import MarketScreen from "@/screens/MarketScreen";
import GalleryScreen from "@/screens/GalleryScreen";
import NewsFeedScreen from "@/screens/NewsFeedScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type HomeStackParamList = {
  Home: undefined;
  Champions: undefined;
  WallOfFame: undefined;
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
      <Stack.Screen
        name="WallOfFame"
        component={WallOfFameScreen}
        options={{
          headerTitle: "WALL OF FAME",
        }}
      />
      <Stack.Screen
        name="Market"
        component={MarketScreen}
        options={{
          headerTitle: "MARKET",
        }}
      />
      <Stack.Screen
        name="Gallery"
        component={GalleryScreen}
        options={{
          headerTitle: "GALLERY",
        }}
      />
      <Stack.Screen
        name="NewsFeed"
        component={NewsFeedScreen}
        options={{
          headerTitle: "NEWS FEED",
        }}
      />
    </Stack.Navigator>
  );
}
