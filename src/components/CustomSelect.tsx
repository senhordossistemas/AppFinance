import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
} from 'react-native';

interface SelectItem {
  label: string;
  value: string;
  icon?: string;
}

interface CustomSelectProps {
  items: SelectItem[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  style?: any;
}

export function CustomSelect({ 
  items, 
  selectedValue, 
  onValueChange, 
  placeholder, 
  style 
}: CustomSelectProps) {
  const [isVisible, setIsVisible] = useState(false);

  const selectedItem = items.find(item => item.value === selectedValue);

  const handleSelect = (value: string) => {
    onValueChange(value);
    setIsVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.selector, style]}
        onPress={() => setIsVisible(true)}
      >
        <Text style={[
          styles.selectorText,
          !selectedItem && styles.placeholderText
        ]}>
          {selectedItem ? `${selectedItem.icon || ''} ${selectedItem.label}` : placeholder}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsVisible(false)}>
              <Text style={styles.cancelButton}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Selecionar</Text>
            <View style={styles.spacer} />
          </View>
          
          <ScrollView style={styles.optionsList}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.option,
                  selectedValue === item.value && styles.selectedOption
                ]}
                onPress={() => handleSelect(item.value)}
              >
                <Text style={[
                  styles.optionText,
                  selectedValue === item.value && styles.selectedOptionText
                ]}>
                  {item.icon && `${item.icon} `}{item.label}
                </Text>
                {selectedValue === item.value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  selectorText: {
    fontSize: 16,
    color: '#2D3748',
    flex: 1,
  },
  placeholderText: {
    color: '#A0AEC0',
  },
  arrow: {
    fontSize: 12,
    color: '#718096',
  },
  modal: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  cancelButton: {
    fontSize: 16,
    color: '#4299E1',
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  spacer: {
    width: 60,
  },
  optionsList: {
    flex: 1,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  selectedOption: {
    backgroundColor: '#EBF8FF',
  },
  optionText: {
    fontSize: 16,
    color: '#2D3748',
    flex: 1,
  },
  selectedOptionText: {
    color: '#2B6CB0',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 16,
    color: '#2B6CB0',
    fontWeight: '600',
  },
});
