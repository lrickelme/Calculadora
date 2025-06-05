import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, View, Text, StyleSheet, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Mode = 'Básica' | 'Científica' | 'Notas Matemáticas' | 'Conversor';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelectMode: (mode: Mode) => void;
};

const modeIcons: Record<Mode, React.ReactNode> = {
  'Básica': <Icon name="calculator" size={20} color="white" style={{ marginRight: 10 }} />,
  'Científica': <Icon name="function" size={20} color="white" style={{ marginRight: 10 }} />,
  'Notas Matemáticas': <Icon name="math-integral" size={20} color="white" style={{ marginRight: 10 }} />,
  'Conversor': <Icon name="swap-horizontal" size={20} color="white" style={{ marginRight: 10 }} />,
};

export default function SideDrawer({ visible, onClose, onSelectMode }: Props) {
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
      <Animated.View style={[styles.drawerMenu, { left: slideAnim }]}>
        {(['Básica', 'Científica', 'Notas Matemáticas', 'Conversor'] as Mode[]).map((m) => (
          <TouchableOpacity
            key={m}
            onPress={() => {
              onSelectMode(m);
              onClose();
            }}
            style={styles.menuItemRow}
          >
            {modeIcons[m]}
            <Text style={styles.menuItem}>{m}</Text>
          </TouchableOpacity>
        ))}
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
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  menuItem: {
    fontSize: 20,
    color: 'white',
  },
});
