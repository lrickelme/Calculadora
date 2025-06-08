import React, { useEffect, useRef } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform,} from 'react-native';

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

  return (
    <>
      {visible && (
        <TouchableOpacity style={styles.overlay} onPress={onClose} />
      )}
      <Animated.View style={[styles.drawer, { left: slideAnim }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Histórico</Text>
          <TouchableOpacity onPress={onClear}>
            <Text style={styles.clearText}>Limpar</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {history.length === 0 && <Text style={styles.emptyText}>Sem histórico</Text>}
          {history.map((item, idx) => (
            <Text key={idx} style={styles.historyItem}>{item}</Text>
          ))}
        </ScrollView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000080',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: '#222',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 65,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'sans-serif',
  },
  clearText: {
    fontSize: 16,
    color: '#f90',
  },
  scrollContent: {
    flexGrow: 1,
  },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
  },
  historyItem: {
    color: 'white',
    marginBottom: 8,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'sans-serif',
  },
});
