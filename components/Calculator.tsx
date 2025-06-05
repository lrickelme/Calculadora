import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CalculatorButtons from './CalculatorButtons';
import ModeMenuModal from './ModeMenuModal';
import SideDrawer from './SideDrawer';

type Mode = 'Básica' | 'Científica' | 'Notas Matemáticas' | 'Conversor';

export default function Calculator() {
  const [display, setDisplay] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<Mode>('Básica');
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuLateralVisible, setMenuLateralVisible] = useState(false);

  const handlePress = (button: string) => {
    if (button === 'menu') {
      setMenuVisible(true);
    } else if (button === 'AC') {
      setDisplay('');
      setResult('');
    } else if (button === '=') {
      try {
        const expression = display.replace(/x/g, '*').replace(/,/g, '.');
        setResult(eval(expression).toString());
      } catch {
        setResult('Erro');
      }
    } else {
      setDisplay(display + button);
    }
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
      {mode === 'Básica' && <CalculatorButtons onPress={handlePress} />}

      {/* Modal de seleção de modo */}
      <ModeMenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onSelectMode={(m) => setMode(m)}
      />

      {/* Menu lateral */}
      <SideDrawer
        visible={menuLateralVisible}
        onClose={() => setMenuLateralVisible(false)}
        onSelectMode={(m) => setMode(m)}
      />
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
});
