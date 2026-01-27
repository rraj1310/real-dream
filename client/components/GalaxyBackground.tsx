import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface GalaxyBackgroundProps {
  children: React.ReactNode;
}

export function GalaxyBackground({ children }: GalaxyBackgroundProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0D0B1E", "#1A1040", "#2D1B4E", "#1A1533"]}
        locations={[0, 0.3, 0.6, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.starsOverlay}>
        <View style={[styles.star, { top: "5%", left: "15%" }]} />
        <View style={[styles.star, { top: "8%", left: "75%" }]} />
        <View style={[styles.star, { top: "12%", left: "45%" }]} />
        <View style={[styles.star, { top: "3%", left: "85%" }]} />
        <View style={[styles.star, { top: "15%", left: "25%" }]} />
        <View style={[styles.star, { top: "7%", left: "55%" }]} />
        <View style={[styles.starLarge, { top: "10%", left: "70%" }]} />
        <View style={[styles.starLarge, { top: "6%", left: "30%" }]} />
      </View>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0B1E",
  },
  starsOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  star: {
    position: "absolute",
    width: 2,
    height: 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 1,
    opacity: 0.5,
  },
  starLarge: {
    position: "absolute",
    width: 3,
    height: 3,
    backgroundColor: "#FFFFFF",
    borderRadius: 1.5,
    opacity: 0.7,
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
});
