import React from 'react';
import { Dimensions, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Mode = 'Básica' | 'Científica' | 'Conversor';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelectMode: (mode: Mode) => void;
};

const modeIcons: Record<Mode, React.ReactNode> = {
  'Básica': <Icon name="calculator" size={20} color="white" style={{ marginRight: 10 }} />,
  'Científica': <Icon name="function" size={20} color="white" style={{ marginRight: 10 }} />,
  'Conversor': <Icon name="swap-horizontal" size={20} color="white" style={{ marginRight: 10 }} />,
};
const { width, height } = Dimensions.get('window');

export default function ModeMenuModal({ visible, onClose, onSelectMode }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.menuModal}>
          {(['Básica', 'Científica', 'Conversor'] as Mode[]).map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => { onSelectMode(m); onClose(); }}
              style={styles.menuItemRow}
            >
              {modeIcons[m]}
              <Text style={styles.menuItem}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    paddingTop: height * 0.1,
    flex: 1,
    justifyContent: 'flex-end',
  },
  menuModal: {
    backgroundColor: '#222',
    padding: width * 0.05,
    borderTopLeftRadius: width * 0.05,
    borderTopRightRadius: width * 0.05,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  menuItem: {
    fontSize: width * 0.05,
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'sans-serif',
  },
});

