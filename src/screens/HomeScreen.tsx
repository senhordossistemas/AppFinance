import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useApp } from '../contexts/AppContext';
import { TransactionCard } from '../components/TransactionCard';
import { PersonSummary } from '../components/PersonSummary';
import { formatCurrency } from '../utils/helpers';

interface HomeScreenProps {
  navigation: any;
}

export function HomeScreen({ navigation }: HomeScreenProps) {
  const {
    isLoading,
    transactions,
    persons,
    accounts,
    refreshData,
    getTotalBalance,
    getExpensesByPerson,
  } = useApp();

  const totalBalance = getTotalBalance();
  const expensesByPerson = getExpensesByPerson();
  const recentTransactions = transactions.slice(0, 10);

  const handleAddTransaction = () => {
    navigation.navigate('AddTransaction');
  };

  const handleAddPerson = () => {
    navigation.navigate('AddPerson');
  };

  const handleAddAccount = () => {
    navigation.navigate('AddAccount');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshData} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AppFinance</Text>
          <Text style={styles.headerSubtitle}>Controle suas finanças</Text>
        </View>

        {/* Saldo Total */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo Total</Text>
          <Text style={[styles.balanceAmount, { color: totalBalance >= 0 ? '#00B894' : '#FF6B6B' }]}>
            {formatCurrency(totalBalance)}
          </Text>
          <Text style={styles.accountsCount}>
            {accounts.length} conta{accounts.length !== 1 ? 's' : ''} ativa{accounts.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Resumo por Pessoa */}
        {persons.length > 0 && Object.keys(expensesByPerson).length > 0 && (
          <PersonSummary persons={persons} expensesByPerson={expensesByPerson} />
        )}

        {/* Ações Rápidas */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleAddTransaction}>
              <Text style={styles.actionIcon}>💰</Text>
              <Text style={styles.actionText}>Nova Transação</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleAddPerson}>
              <Text style={styles.actionIcon}>👤</Text>
              <Text style={styles.actionText}>Nova Pessoa</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleAddAccount}>
              <Text style={styles.actionIcon}>🏦</Text>
              <Text style={styles.actionText}>Nova Conta</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transações Recentes */}
        <View style={styles.recentTransactions}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transações Recentes</Text>
            {transactions.length > 10 && (
              <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
                <Text style={styles.seeAllText}>Ver todas</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {recentTransactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📋</Text>
              <Text style={styles.emptyStateTitle}>Nenhuma transação</Text>
              <Text style={styles.emptyStateDescription}>
                Comece adicionando sua primeira transação
              </Text>
              <TouchableOpacity style={styles.emptyStateButton} onPress={handleAddTransaction}>
                <Text style={styles.emptyStateButtonText}>Adicionar Transação</Text>
              </TouchableOpacity>
            </View>
          ) : (
            recentTransactions.map(transaction => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onPress={() => {
                  // Navegar para detalhes da transação (implementar depois)
                  console.log('Transação selecionada:', transaction.id);
                }}
              />
            ))
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#718096',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2D3748',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#718096',
    marginTop: 4,
  },
  balanceCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  accountsCount: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  quickActions: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D3748',
    textAlign: 'center',
  },
  recentTransactions: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#4299E1',
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#4299E1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
