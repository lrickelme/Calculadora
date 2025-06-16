import React from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type Props = {
  onPress: (value: string) => void;
  onLongPress: () => void;
  isScientific?: boolean;
};

const basicButtons = [
  ["AC", "±", "%", "/"],
  ["7", "8", "9", "x"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["menu", "0", ",", "="],
];

const orangeButtons = ["=", "+", "-", "x", "/"];
const greyButtons = ["AC", "±", "%"];
const { width, height } = Dimensions.get('window');

export default function CalculatorButtons({
  onPress,
  isScientific = false,
  onLongPress,
}: Props) {
  return (
    <>
      {basicButtons.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((btn) => (
            <TouchableOpacity
              key={btn}
              style={[
                styles.button,
                isScientific ? styles.scientificButton : {},
                btn === "menu"
                  ? styles.menuIconButton
                  : orangeButtons.includes(btn)
                  ? styles.equals
                  : greyButtons.includes(btn)
                  ? styles.grey
                  : {},
              ]}
              onPress={() => onPress(btn)}
              onLongPress={() => onLongPress()}
            >
              {btn === "menu" ? (
                <Icon
                  name="calculator"
                  size={isScientific ? 24 : 40}
                  color="#fff"
                />
              ) : (
                <Text
                  style={[
                    styles.buttonText,
                    isScientific && styles.scientificButtonText,
                  ]}
                >
                  {btn}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.01,
  },
  button: {
    backgroundColor: "#333",
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: (width * 0.2) / 2,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  scientificButton: {
    width: width * 0.23,
    height: height * 0.065,
    borderRadius: width * 0.17,
  },
  equals: {
    backgroundColor: "#f90",
  },
  grey: {
    backgroundColor: "#808080",
  },
  buttonText: {
    fontSize: width * 0.08,
    color: "white",
  },
  scientificButtonText: {
    fontSize: width * 0.06,
  },
  menuIconButton: {
    backgroundColor: "#333",
  },
});
