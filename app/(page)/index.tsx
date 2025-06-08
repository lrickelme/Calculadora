import { useNavigation } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function Page() {
  const navigate = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Calculator App!</Text>
      <Button
        title="Go to Calculator"
        onPress={() => {
          navigate.goBack();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  text: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
});
