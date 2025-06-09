import { PanicButton } from "@/components/PanicButton";
import React from "react";
import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";
import Calculator from "../components/Calculator";

export default function CalculatorScreen() {
  const { height, width } = useWindowDimensions();
  const valueActive = "911+=";

  return (
    <View style={[styles.container]}>
      <Calculator valueActive={valueActive} />
      <PanicButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: Platform.OS === "ios" ? 210 : 160,
    paddingHorizontal: 10,
  },
});
