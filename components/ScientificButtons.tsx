import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingHorizontal: 3,
  },
  button: {
    backgroundColor: '#1C1C1C',
    width: 65,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
});

