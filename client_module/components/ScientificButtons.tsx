import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

type Props = {
  onPress: (value: string) => void;
};

export default function ScientificButtons({ onPress }: Props) {
  const scientificRows = [
    ['(', ')', 'mc', 'm+', 'm-', 'mr'],
    ['2nd', 'x²', 'x³', 'xʸ', 'eˣ', '10ˣ'],
    ['1/x', '²√x', '³√x', 'ʸ√x', 'ln', 'log₁₀'],
    ['x!', 'sin', 'cos', 'tan', 'e', 'EE'],
    ['Rand', 'sinh', 'cosh', 'tanh', 'π', 'Rad'],
  ];

  return (
    <>
      {scientificRows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((btn) => (
            <TouchableOpacity key={btn} style={styles.button} onPress={() => onPress(btn)}>
              <Text style={styles.buttonText}>{btn}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: height * 0.007,
    paddingHorizontal: width * 0.01,
  },
  button: {
    backgroundColor: '#1C1C1C',
    width: width * 0.14,
    height: height * 0.06,
    borderRadius: width * 0.075,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: width * 0.005,
  },
  buttonText: {
    fontSize: width * 0.04,
    color: 'white',
  },
});
