import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useApp } from '../contexts/AppContext';
import { TransactionFormData } from '../types';
import { CustomSelect } from '../components/CustomSelect';

interface AddTransactionScreenProps {
  navigation: any;
}

export function AddTransactionScreen({ navigation }: AddTransactionScreenProps) {
  const { persons, accounts, categories, addTransaction } = useApp();
  
  // Debug: Verificar se os dados estão sendo carregados
  React.useEffect(() => {
    console.log('=== DEBUG AddTransactionScreen ===');
    console.log('Categories:', categories.length, categories);
    console.log('Accounts:', accounts.length, accounts);
    console.log('Persons:', persons.length, persons);
  }, [categories, accounts, persons]);
  
  const [formData, setFormData] = useState<TransactionFormData>({
    description: '',
    amount: 0,
    type: 'expense',
    categoryId: '',
    accountId: '',
    assignedToPersonId: '',
    paidByPersonId: 'owner', // Padrão é o proprietário
    date: new Date(),
    notes: '',
    isRecurring: false,
    attachments: [],
    tags: [],
  });
  
  const [amountText, setAmountText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAmountChange = (text: string) => {
    // Remove caracteres não numéricos exceto vírgula e ponto
    const cleanText = text.replace(/[^0-9.,]/g, '');
    setAmountText(cleanText);
    
    // Converte para número
    const numericValue = parseFloat(cleanText.replace(',', '.')) || 0;
    setFormData(prev => ({ ...prev, amount: numericValue }));
  };

  const handleSubmit = async () => {
    // Validações
    if (!formData.description.trim()) {
      Alert.alert('Erro', 'Descrição é obrigatória');
      return;
    }
    
    if (formData.amount <= 0) {
      Alert.alert('Erro', 'Valor deve ser maior que zero');
      return;
    }
    
    if (!formData.categoryId) {
      Alert.alert('Erro', 'Selecione uma categoria');
      return;
    }
    
    if (!formData.accountId) {
      Alert.alert('Erro', 'Selecione uma conta');
      return;
    }
    
    if (!formData.assignedToPersonId) {
      Alert.alert('Erro', 'Selecione para quem é a despesa');
      return;
    }

    try {
      setIsLoading(true);
      await addTransaction(formData);
      Alert.alert(
        'Sucesso',
        'Transação adicionada com sucesso!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Erro', 'Falha ao adicionar transação');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const availableCategories = categories.filter(cat => cat.type === formData.type);
  const ownerPerson = persons.find(p => p.isOwner);

  // Verificar se os dados essenciais estão carregados
  const isDataLoaded = categories.length > 0 && accounts.length > 0 && persons.length > 0;

  if (!isDataLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando dados...</Text>
          <Text style={styles.debugText}>
            Categorias: {categories.length}, Contas: {accounts.length}, Pessoas: {persons.length}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Nova Transação</Text>
        </View>

        {/* Tipo de Transação */}
        <View style={styles.section}>
          <Text style={styles.label}>Tipo de Transação</Text>
          <View style={styles.typeButtons}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                formData.type === 'expense' && styles.typeButtonActive,
                formData.type === 'expense' && styles.expenseButton,
              ]}
              onPress={() => setFormData(prev => ({ ...prev, type: 'expense', categoryId: '' }))}
            >
              <Text style={[
                styles.typeButtonText,
                formData.type === 'expense' && styles.typeButtonTextActive,
              ]}>
                💸 Despesa
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.typeButton,
                formData.type === 'income' && styles.typeButtonActive,
                formData.type === 'income' && styles.incomeButton,
              ]}
              onPress={() => setFormData(prev => ({ ...prev, type: 'income', categoryId: '' }))}
            >
              <Text style={[
                styles.typeButtonText,
                formData.type === 'income' && styles.typeButtonTextActive,
              ]}>
                💰 Receita
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Descrição */}
        <View style={styles.section}>
          <Text style={styles.label}>Descrição *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ex: Almoço no restaurante"
            value={formData.description}
            onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
          />
        </View>

        {/* Valor */}
        <View style={styles.section}>
          <Text style={styles.label}>Valor *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="0,00"
            value={amountText}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
          />
        </View>

        {/* Categoria */}
        <View style={styles.section}>
          <Text style={styles.label}>Categoria *</Text>
          <CustomSelect
            selectedValue={formData.categoryId}
            onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
            placeholder="Selecione uma categoria"
            items={availableCategories.map(category => ({
              label: `${category.icon} ${category.name}`,
              value: category.id
            }))}
          />
        </View>

        {/* Conta/Cartão */}
        <View style={styles.section}>
          <Text style={styles.label}>Conta/Cartão *</Text>
          <CustomSelect
            selectedValue={formData.accountId}
            onValueChange={(value) => setFormData(prev => ({ ...prev, accountId: value }))}
            placeholder="Selecione uma conta"
            items={accounts.map(account => ({
              label: `${account.name} (${account.type})`,
              value: account.id
            }))}
          />
        </View>

        {/* FUNCIONALIDADE PRINCIPAL: Atribuir a Pessoa */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Esta {formData.type === 'expense' ? 'despesa' : 'receita'} é de quem? *
          </Text>
          <Text style={styles.helperText}>
            {formData.type === 'expense' 
              ? 'Selecione a pessoa responsável por esta despesa' 
              : 'Selecione quem recebeu esta receita'}
          </Text>
          <CustomSelect
            selectedValue={formData.assignedToPersonId}
            onValueChange={(value) => setFormData(prev => ({ ...prev, assignedToPersonId: value }))}
            placeholder="Selecione uma pessoa"
            items={persons.map(person => ({
              label: `${person.name}${person.isOwner ? ' (Você)' : ''}`,
              value: person.id
            }))}
          />
        </View>

        {/* Pago por (apenas para despesas) */}
        {formData.type === 'expense' && (
          <View style={styles.section}>
            <Text style={styles.label}>Pago por</Text>
            <Text style={styles.helperText}>
              Quem efetivamente pagou esta conta/usou o cartão
            </Text>
            <CustomSelect
              selectedValue={formData.paidByPersonId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, paidByPersonId: value }))}
              placeholder="Selecione quem pagou"
              items={persons.map(person => ({
                label: `${person.name}${person.isOwner ? ' (Você)' : ''}`,
                value: person.id
              }))}
            />
          </View>
        )}

        {/* Observações */}
        <View style={styles.section}>
          <Text style={styles.label}>Observações</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Observações adicionais..."
            value={formData.notes}
            onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Salvando...' : 'Salvar Transação'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
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
  section: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginBottom: 0,
    padding: 16,
    borderRadius: 12,
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
    marginBottom: 12,
    fontStyle: 'italic',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  typeButtonActive: {
    borderWidth: 2,
  },
  expenseButton: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFF5F5',
  },
  incomeButton: {
    borderColor: '#00B894',
    backgroundColor: '#F0FFF4',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
  },
  typeButtonTextActive: {
    color: '#2D3748',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2D3748',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#4299E1',
    margin: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2D3748',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
  },
});
