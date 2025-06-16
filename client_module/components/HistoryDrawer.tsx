import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Dimensions,
} from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  onClear: () => void;
  history: string[];
};

const { width, height } = Dimensions.get('window');

export default function HistoryDrawer({ visible, onClose, onClear, history }: Props) {
  const slideAnim = useRef(new Animated.Value(-width * 0.65)).current;
  const [isMounted, setIsMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width * 0.65,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: false,
      }).start(() => {
        setIsMounted(false);
      });
    }
  }, [visible]);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <TouchableOpacity style={styles.overlay} onPress={onClose} />
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
            <Text key={idx} style={styles.historyItem}>
              {item}
            </Text>
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
    width: width * 0.65,
    backgroundColor: '#222',
    padding: width * 0.05,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.025,
    marginTop: height * 0.08,
  },
  title: {
    fontSize: width * 0.055,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'sans-serif',
  },
  clearText: {
    fontSize: width * 0.04,
    color: '#f90',
  },
  scrollContent: {
    flexGrow: 1,
  },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
    fontSize: width * 0.04,
  },
  historyItem: {
    color: 'white',
    marginBottom: height * 0.01,
    fontSize: width * 0.04,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'sans-serif',
  },
});
