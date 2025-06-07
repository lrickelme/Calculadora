import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import HistoryDrawer from './HistoryDrawer';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CalculatorButtons from './CalculatorButtons';
import ModeMenuModal from './ModeMenuModal';
import ScientificButtons from './ScientificButtons';

type Mode = 'Básica' | 'Científica' | 'Conversor';

export default function Calculator() {
  const [display, setDisplay] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<Mode>('Básica');
  const [menuVisible, setMenuVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const slideAnim = useRef(new Animated.Value(-250)).current;

  useEffect(() => {
    const loadHistory = async () => {
      const savedHistory = await AsyncStorage.getItem('calculator_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    if (historyVisible) {
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
  }, [historyVisible]);

  const addToHistory = async (entry: string) => {
    const newHistory = [entry, ...history].slice(0, 50);
    setHistory(newHistory);
    await AsyncStorage.setItem('calculator_history', JSON.stringify(newHistory));
  };

  const handlePress = (button: string) => {
    if (button === 'menu') {
      setMenuVisible(true);
    } else if (button === 'AC') {
      setDisplay('');
      setResult('');
    } else if (button === '=') {
      try {
        const expression = display.replace(/x/g, '*').replace(/,/g, '.');
        const resultValue = eval(expression).toString();
        setResult(resultValue);

        const entry = `${display} = ${resultValue}`;
        addToHistory(entry);
      } catch {
        setResult('Erro');
      }
    } else {
      setDisplay(display + button);
    }
  };

  return (
    <View style={[styles.container, mode === 'Científica' && styles.scientificContainer]}>
      {/* Display */}
      <View style={styles.display}>
        <Text style={styles.resultText}>{result || display || '0'}</Text>
      </View>

      {/* Botão pra abrir o histórico */}
      <TouchableOpacity onPress={() => setHistoryVisible(true)} style={styles.menuButton}>
        <Text style={styles.menuText}>≡</Text>
      </TouchableOpacity>

      {/* Botões */}
      {mode === 'Básica' && <CalculatorButtons onPress={handlePress} />}
      {mode === 'Científica' && (
        <>
          <ScientificButtons onPress={handlePress} />
          <CalculatorButtons onPress={handlePress} isScientific />
        </>
      )}

      {/* Modal de seleção de modo (pop-up que não é pop-up ainda) */}
      <ModeMenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onSelectMode={(m) => setMode(m)}
      />

      {/* Histórico de Calculo */}
     <HistoryDrawer
        visible={historyVisible}
        onClose={() => setHistoryVisible(false)}
        onClear={async () => {
          await AsyncStorage.removeItem('calculator_history');
          setHistory([]);
        }}
        history={history}
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
  scientificContainer: {
    paddingTop: 99,
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
  historyTitle: {
    fontSize: 22,
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
});
