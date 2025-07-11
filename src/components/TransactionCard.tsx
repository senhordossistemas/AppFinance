import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Transaction } from '../types';
import { formatCurrency, formatDateShort } from '../utils/helpers';

interface TransactionCardProps {
  transaction: Transaction & {
    categoryName?: string;
    categoryIcon?: string;
    assignedToName?: string;
    paidByName?: string;
    accountName?: string;
  };
  onPress?: () => void;
}

export function TransactionCard({ transaction, onPress }: TransactionCardProps) {
  const isExpense = transaction.type === 'expense';
  const amountColor = isExpense ? '#FF6B6B' : '#00B894';
  const amountPrefix = isExpense ? '-' : '+';

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.leftSection}>
        <Text style={styles.icon}>{transaction.categoryIcon || '💰'}</Text>
        <View style={styles.info}>
          <Text style={styles.description}>{transaction.description}</Text>
          <View style={styles.details}>
            <Text style={styles.detailText}>
              {transaction.assignedToName} • {transaction.accountName}
            </Text>
            {transaction.assignedToPersonId !== transaction.paidByPersonId && (
              <Text style={styles.paidByText}>
                Pago por: {transaction.paidByName}
              </Text>
            )}
          </View>
        </View>
      </View>
      
      <View style={styles.rightSection}>
        <Text style={[styles.amount, { color: amountColor }]}>
          {amountPrefix}{formatCurrency(transaction.amount)}
        </Text>
        <Text style={styles.date}>
          {formatDateShort(transaction.date)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
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
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  details: {
    gap: 2,
  },
  detailText: {
    fontSize: 12,
    color: '#718096',
  },
  paidByText: {
    fontSize: 11,
    color: '#E53E3E',
    fontStyle: 'italic',
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#718096',
  },
});
