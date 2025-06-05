import React from 'react';
import { Modal, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
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

export default function ModeMenuModal({ visible, onClose, onSelectMode }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.menuModal}>
          {(['Básica', 'Científica', 'Notas Matemáticas', 'Conversor'] as Mode[]).map((m) => (
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
    paddingTop: 95,
    flex: 1,
    justifyContent: 'flex-end',
  },
  menuModal: {
    backgroundColor: '#222',
    padding: 20,
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
