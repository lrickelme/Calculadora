import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Mode = 'Básica' | 'Científica' | 'Conversor';

const basicButtons = [
  ['AC', '±', '%', '/'],
  ['7', '8', '9', 'x'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['menu', '0', ',', '='],
];

const orangeButtons = ['=', '+', '-', 'x', '/'];
const greyButtons = ['AC', '±', '%'];

export default function Calculator() {
  const [display, setDisplay] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<Mode>('Básica');
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuLateralVisible, setMenuLateralVisible] = useState(false);

  const slideAnim = useRef(new Animated.Value(-250)).current;

  useEffect(() => {
    if (menuLateralVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -250,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: false,
      }).start();
    }
  }, [menuLateralVisible]);

  const handlePress = (button: string) => {
    if (button === 'menu') {
      setMenuVisible(true);
    } else if (button === 'AC') {
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
            onPress={() => handlePress(btn)}
          >
            <Text style={btn === 'menu' ? styles.menuIconText : styles.buttonText}>
              {btn === 'menu' ? '⌸' : btn}
            </Text>
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

      {/* ≡ Menu lateral button */}
      <TouchableOpacity onPress={() => setMenuLateralVisible(true)} style={styles.menuButton}>
        <Text style={styles.menuText}>≡</Text>
      </TouchableOpacity>

      {/* Buttons */}
      {mode === 'Básica' && renderButtons()}

      {/* Bottom Modal */}
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

      {/* Side Drawer Animated View */}
      {menuLateralVisible && (
        <TouchableOpacity
          style={styles.lateralOverlay}
          onPress={() => setMenuLateralVisible(false)}
          activeOpacity={1}
        >
          <Animated.View style={[styles.drawerMenu, { left: slideAnim }]}>
            {(['Básica', 'Científica', 'Conversor'] as Mode[]).map((m) => (
              <TouchableOpacity
                key={m}
                onPress={() => {
                  setMode(m);
                  setMenuLateralVisible(false);
                }}
              >
                <Text style={styles.menuItem}>{m}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </TouchableOpacity>
      )}
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
    top: 50,
    left: 20,
    zIndex: 10,
  },
  menuText: {
    fontSize: 30,
    color: '#f90',
  },
  menuIconButton: {
    backgroundColor: '#333',
  },
  menuIconText: {
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
  lateralOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 100,
  },
  drawerMenu: {
    width: 250,
    height: '100%',
    backgroundColor: '#222',
    paddingTop: 60,
    paddingHorizontal: 20,
    position: 'absolute',
  },
});
