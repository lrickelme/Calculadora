import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  onPress: (value: string) => void;
  isScientific?: boolean;
};

const basicButtons = [
  ['AC', '±', '%', '/'],
  ['7', '8', '9', 'x'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['menu', '0', ',', '='],
];

const orangeButtons = ['=', '+', '-', 'x', '/'];
const greyButtons = ['AC', '±', '%'];

export default function CalculatorButtons({ onPress, isScientific = false }: Props) {
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
                <Icon name="calculator" size={isScientific ? 24 : 40} color="#fff" />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  button: {
    backgroundColor: '#333',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
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
    width: 95,
    height: 53,
    borderRadius: 35,
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
  scientificButtonText: {
    fontSize: 24,
  },
  menuIconButton: {
    backgroundColor: '#333',
  },
});
