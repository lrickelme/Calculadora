import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  onClear: () => void;
  history: string[];
};

export default function HistoryDrawer({ visible, onClose, onClear, history }: Props) {
  const slideAnim = useRef(new Animated.Value(-250)).current;

  useEffect(() => {
    if (visible) {
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
  }, [visible]);

  if (!visible) return null;

  return (
    <TouchableOpacity
      style={styles.lateralOverlay}
      onPress={onClose}
      activeOpacity={1}
    >
      <Animated.View
        style={[styles.drawerMenu, { left: slideAnim }]}
        onStartShouldSetResponder={() => true}
      >
        <Text style={styles.historyTitle}>Últimos 50 cálculos</Text>
        <ScrollView style={styles.historyList}>
          {history.slice(0, 50).map((entry, index) => (
            <View key={index} style={styles.historyItem}>
              <Text style={styles.historyText}>{entry}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Botões Limpar / OK */}
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <Text style={styles.buttonText}>Limpar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.okButton}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 15,
    textAlign: 'center',
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    marginBottom: 10,
  },
  historyText: {
    fontSize: 16,
    color: 'white',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  clearButton: {
    backgroundColor: '#f00',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  okButton: {
    backgroundColor: '#0f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
