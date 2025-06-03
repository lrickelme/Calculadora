import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Mode = 'Básica' | 'Científica' | 'Conversor';

const basicButtons = [
  ['AC', '±', '%', '/'],
  ['7', '8', '9', 'x'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['a', '0', ',', '='],
];

const orangeButtons = [
  '=', '+', '-', 'x', '/'
]

const greyButtons = [
  'AC', '±', '%'
]

export default function Calculator() {
  const [display, setDisplay] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<Mode>('Básica');
  const [menuVisible, setMenuVisible] = useState(false);

  const handlePress = (button: string) => {
    if (button === 'AC') {
      setDisplay('');
      setResult('');
    } else if (button === '=') {
      try {
        const expression = display.replace('x', '*').replace(',', '.');
        setResult(eval(expression).toString());
      } catch {
        setResult('Erro');
      }
    } else {
      setDisplay(display + button);
    }
  };

  const renderButtons = () => {
    return basicButtons.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.row}>
        {row.map((btn) => (
          <TouchableOpacity
            key={btn}
            style={[styles.button,  orangeButtons.includes(btn) ? styles.equals:  greyButtons.includes(btn) ? styles.grey : {}]}
            onPress={() => handlePress(btn)}
          >
            <Text style={styles.buttonText}>{btn}</Text>
          </TouchableOpacity>
        ))}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      {/* Display */}
      <View style={styles.display}>
        <Text style={styles.resultText}>{result || display || '0'}</Text>
      </View>

      {/* Menu Button */}
      <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
        <Text style={styles.menuText}>≡</Text>
      </TouchableOpacity>

      {/* Button Area */}
      {mode === 'Básica' && renderButtons()}

      {/* Modal for Modes */}
      <Modal visible={menuVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuModal}>
            {(['Básica', 'Científica', 'Conversor'] as Mode[]).map((m) => (
              <TouchableOpacity key={m} onPress={() => { setMode(m); setMenuVisible(false); }}>
                <Text style={styles.menuItem}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 210,
    paddingHorizontal: 10,
  },
  display: {
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  resultText: {
    fontSize: 60,
    color: 'white',
  },
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
  menuButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  menuText: {
    fontSize: 30,
    color: '#f90',
  },
  modalOverlay: {
    paddingTop: 95,
    flex: 1,
    justifyContent: 'flex-end',
  },
  menuModal: {
    backgroundColor: '#222',
    padding: 20,
  },
  menuItem: {
    fontSize: 20,
    color: 'white',
    marginBottom: 15,
  },
});
