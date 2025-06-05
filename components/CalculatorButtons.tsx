import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const orangeButtons = ['=', '+', '-', 'x', '/'];
const greyButtons = ['AC', '±', '%'];

const basicButtons = [
  ['AC', '±', '%', '/'],
  ['7', '8', '9', 'x'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['menu', '0', ',', '='],
];

type Props = {
  onPress: (button: string) => void;
};

export default function CalculatorButtons({ onPress }: Props) {
  return (
    <>
      {basicButtons.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((btn) => (
            <TouchableOpacity
              key={btn}
              style={[
                styles.button,
                btn === 'menu'
                  ? styles.menuIconButton
                  : orangeButtons.includes(btn)
                  ? styles.equals
                  : greyButtons.includes(btn)
                  ? styles.grey
                  : {},
              ]}
              onPress={() => onPress(btn)}
            >
              {btn === 'menu' ? (
                <Icon name="calculator" size={40} color="#fff" />
              ) : (
                <Text style={styles.buttonText}>{btn}</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#333',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  equals: {
    backgroundColor: '#f90',
  },
  grey: {
    backgroundColor: '#808080',
  },
  buttonText: {
    fontSize: 32,
    color: 'white',
  },
  menuIconButton: {
    backgroundColor: '#333',
  },
});
