import { completeSequence, startSequence } from "@/hooks/useSequenceTime";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { DeviceMotion } from "expo-sensors";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Vibration,
  View,
} from "react-native";
import CalculatorButtons from "./CalculatorButtons";
import HistoryDrawer from "./HistoryDrawer";
import ModeMenuModal from "./ModeMenuModal";
import ScientificButtons from "./ScientificButtons";

type Mode = "Básica" | "Científica" | "Conversor";
const { width, height } = Dimensions.get("window");
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
  const [isResultDisplayed, setIsResultDisplayed] = useState(false);
  const router = useRouter();
  const { height, width } = useWindowDimensions();

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
      setIsResultDisplayed(false);
    } else if (button === "=") {
      try {
        const expression = display.replace(/x/g, "*").replace(/,/g, ".");
        const resultValue = eval(expression).toString();
        setResult(resultValue);
        const entry = `${display} = ${resultValue}`;
        addToHistory(entry);
        setIsResultDisplayed(true);
      } catch {
        if (display + button === valueActive) {
          handleValueActive();
        } else {
          setResult("Erro");
        }
      }
    } else {
      if (isResultDisplayed) {
        if (["+", "-", "*", "/", "x"].includes(button)) {
          setDisplay(result + button);
        } else {
          setDisplay(button);
          setResult("");
        }
        setIsResultDisplayed(false);
      } else {
        setDisplay(display + button);
      }
    }
  };

  return (
    <View
      style={[
        {
          height: height * 0.7,
          width: width - 20,
        },
        mode === "Científica" && styles.scientificContainer,
      ]}
    >
      {/* Display */}
      <View style={[styles.display, { height: height * 0.09 }]}>
        <Text style={styles.resultText}>
          {isResultDisplayed ? result : display || "0"}
        </Text>
      </View>

      {/* Botão pra abrir o histórico */}
      <TouchableOpacity
        onPress={() => setHistoryVisible((prev) => !prev)}
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
    paddingTop: Platform.OS === "ios" ? height * 0.25 : height * 0.18,
    paddingHorizontal: width * 0.025,
  },
  scientificContainer: {
    paddingTop: Platform.OS === "ios" ? height * 0.12 : height * 0.08,
  },
  display: {
    height: height * 0.15,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: height * 0.025,
  },
  resultText: {
    fontSize: width * 0.15,
    color: "white",
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : undefined,
  },
  menuButton: {
    position: "absolute",
    top: height * 0.06,
    left: width * 0.05,
    zIndex: 10,
  },
  menuText: {
    fontSize: width * 0.075,
    color: "#f90",
  },
});
