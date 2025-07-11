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
import { AccountFormData } from '../types';
import { CustomSelect } from '../components/CustomSelect';

interface AddAccountScreenProps {
  navigation: any;
}

export function AddAccountScreen({ navigation }: AddAccountScreenProps) {
  const { addAccount } = useApp();
  
  const [formData, setFormData] = useState<AccountFormData>({
    name: '',
    type: 'checking',
    bankName: '',
    balance: 0,
    currency: 'BRL',
    isActive: true,
  });
  
  const [balanceText, setBalanceText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleBalanceChange = (text: string) => {
    const cleanText = text.replace(/[^0-9.,]/g, '');
    setBalanceText(cleanText);
    
    const numericValue = parseFloat(cleanText.replace(',', '.')) || 0;
    setFormData(prev => ({ ...prev, balance: numericValue }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Erro', 'Nome da conta é obrigatório');
      return;
    }

    try {
      setIsLoading(true);
      await addAccount(formData);
      Alert.alert(
        'Sucesso',
        'Conta adicionada com sucesso!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Erro', 'Falha ao adicionar conta');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const accountTypes = [
    { value: 'checking', label: '🏦 Conta Corrente' },
    { value: 'savings', label: '💰 Poupança' },
    { value: 'credit', label: '💳 Cartão de Crédito' },
    { value: 'debit', label: '💳 Cartão de Débito' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nova Conta</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
        {/* Nome da Conta */}
        <View style={styles.section}>
          <Text style={styles.label}>Nome da Conta *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ex: Conta Corrente Banco do Brasil"
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          />
        </View>

        {/* Tipo de Conta */}
        <View style={styles.section}>
          <Text style={styles.label}>Tipo de Conta *</Text>
          <CustomSelect
            selectedValue={formData.type}
            onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
            placeholder="Selecione o tipo de conta"
            items={accountTypes.map(type => ({
              label: type.label,
              value: type.value
            }))}
          />
        </View>

        {/* Nome do Banco */}
        <View style={styles.section}>
          <Text style={styles.label}>Nome do Banco (opcional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ex: Banco do Brasil, Itaú, Nubank"
            value={formData.bankName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, bankName: text }))}
          />
        </View>

        {/* Saldo Inicial */}
        <View style={styles.section}>
          <Text style={styles.label}>Saldo Inicial</Text>
          <Text style={styles.helperText}>
            Deixe 0 se não quiser informar o saldo atual
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="0,00"
            value={balanceText}
            onChangeText={handleBalanceChange}
            keyboardType="numeric"
          />
        </View>

        {/* Informação */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>🏦</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Sobre Contas e Cartões</Text>
            <Text style={styles.infoText}>
              Adicione suas contas bancárias e cartões para controlar de onde vem e para onde vai seu dinheiro. 
              Os saldos são atualizados automaticamente conforme você adiciona transações.
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
            {isLoading ? 'Salvando...' : 'Adicionar Conta'}
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
  helperText: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 8,
    fontStyle: 'italic',
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
    backgroundColor: '#F0FFF4',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#00B894',
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
    color: '#22543D',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#276749',
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
