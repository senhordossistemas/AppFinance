import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { useApp } from '../contexts/AppContext';
import { PersonFormData } from '../types';

interface AddPersonScreenProps {
  navigation: any;
}

export function AddPersonScreen({ navigation }: AddPersonScreenProps) {
  const { addPerson } = useApp();
  
  const [formData, setFormData] = useState<PersonFormData>({
    name: '',
    email: '',
    avatar: '',
    isOwner: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return;
    }

    try {
      setIsLoading(true);
      await addPerson(formData);
      Alert.alert(
        'Sucesso',
        'Pessoa adicionada com sucesso!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Erro', 'Falha ao adicionar pessoa');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nova Pessoa</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
        {/* Nome */}
        <View style={styles.section}>
          <Text style={styles.label}>Nome *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ex: João Silva"
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          />
        </View>

        {/* Email */}
        <View style={styles.section}>
          <Text style={styles.label}>Email (opcional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="joao@email.com"
            value={formData.email}
            onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Informação */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>💡</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Para que serve?</Text>
            <Text style={styles.infoText}>
              Ao adicionar pessoas, você poderá atribuir despesas e receitas a elas, 
              mesmo quando usar seu próprio cartão ou conta. Perfeito para famílias e grupos!
            </Text>
          </View>
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Salvando...' : 'Adicionar Pessoa'}
          </Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  scrollContainer: {
    flex: 1,
  },
  backButton: {
    fontSize: 16,
    color: '#4299E1',
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2D3748',
  },
  infoCard: {
    backgroundColor: '#EBF8FF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#4299E1',
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2B6CB0',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#2C5282',
    lineHeight: 18,
  },
  saveButton: {
    backgroundColor: '#4299E1',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  saveButtonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
