import { completeSequence, startSequence } from "@/hooks/useSequenceTime";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { DeviceMotion } from "expo-sensors";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import CalculatorButtons from "./CalculatorButtons";
import HistoryDrawer from "./HistoryDrawer";
import ModeMenuModal from "./ModeMenuModal";
import ScientificButtons from "./ScientificButtons";

type Mode = "Básica" | "Científica" | "Conversor";

export default function Calculator({
  valueActive,
}: {
  readonly valueActive?: string;
}) {
  const [display, setDisplay] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState<Mode>("Básica");
  const [menuVisible, setMenuVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const router = useRouter();

  const slideAnim = useRef(new Animated.Value(-250)).current;

  useEffect(() => {
    const loadHistory = async () => {
      const savedHistory = await AsyncStorage.getItem("calculator_history");
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    let lastShake = 0;
    const sub = DeviceMotion.addListener((data) => {
      const rotationRate = data.rotationRate;
      if (rotationRate) {
        const { alpha, beta, gamma } = rotationRate;
        const mag = Math.sqrt(alpha ** 2 + beta ** 2 + gamma ** 2);
        if (mag > 500 && Date.now() - lastShake > 1000) {
          completeSequence(handleValueActive);
          lastShake = Date.now();
        }
      }
    });
    DeviceMotion.setUpdateInterval(100);
    return () => sub.remove();
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
    await AsyncStorage.setItem(
      "calculator_history",
      JSON.stringify(newHistory)
    );
  };

  const handleValueActive = () => {
    Vibration.vibrate([100, 100, 100, 100]);
    router.push("/(page)");
    setDisplay("");
  };

  const handleLongPress = () => {
    startSequence();
  };

  const handlePress = (button: string) => {
    if (button === "menu") {
      setMenuVisible(true);
    } else if (button === "AC") {
      setDisplay("");
      setResult("");
    } else if (button === "=") {
      try {
        const expression = display.replace(/x/g, "*").replace(/,/g, ".");
        const resultValue = eval(expression).toString();
        setResult(resultValue);

        const entry = `${display} = ${resultValue}`;
        addToHistory(entry);
      } catch {
        if (display + button === valueActive) {
          handleValueActive();
        } else {
          setResult("Erro");
        }
      }
    } else {
      setDisplay(display + button);
    }
  };

  return (
    <View
      style={[
        styles.container,
        mode === "Científica" && styles.scientificContainer,
      ]}
    >
      {/* Display */}
      <View style={styles.display}>
        <Text style={styles.resultText}>{result || display || "0"}</Text>
      </View>

      {/* Botão pra abrir o histórico */}
      <TouchableOpacity
        onPress={() => setHistoryVisible(true)}
        style={styles.menuButton}
      >
        <Text style={styles.menuText}>≡</Text>
      </TouchableOpacity>

      {/* Botões */}
      {mode === "Básica" && (
        <CalculatorButtons
          onPress={handlePress}
          onLongPress={handleLongPress}
        />
      )}
      {mode === "Científica" && (
        <>
          <ScientificButtons onPress={handlePress} />
          <CalculatorButtons
            onPress={handlePress}
            onLongPress={handleLongPress}
            isScientific
          />
        </>
      )}

      {/* Modal de seleção de modo */}
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
          await AsyncStorage.removeItem("calculator_history");
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
    backgroundColor: "#000",
    paddingTop: Platform.OS === "ios" ? 210 : 160,
    paddingHorizontal: 10,
  },
  scientificContainer: {
    paddingTop: Platform.OS === "ios" ? 99 : 60,
  },
  display: {
    height: 120,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  resultText: {
    fontSize: 60,
    color: "white",
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : undefined,
  },
  menuButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  menuText: {
    fontSize: 30,
    color: "#f90",
  },
});
