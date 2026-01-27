import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MyRealDreamScreen from "@/screens/MyRealDreamScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type RealDreamStackParamList = {
  MyRealDream: undefined;
  CreateRealDream: undefined;
};

const Stack = createNativeStackNavigator<RealDreamStackParamList>();

export default function RealDreamStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="MyRealDream"
        component={MyRealDreamScreen}
        options={{
          headerTitle: "MY REALDREAM",
        }}
      />
    </Stack.Navigator>
  );
}
