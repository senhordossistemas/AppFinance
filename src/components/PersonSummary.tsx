import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Person } from '../types';
import { formatCurrency } from '../utils/helpers';

interface PersonSummaryProps {
  persons: Person[];
  expensesByPerson: { [personId: string]: number };
}

export function PersonSummary({ persons, expensesByPerson }: PersonSummaryProps) {
  const totalExpenses = Object.values(expensesByPerson).reduce((sum, amount) => sum + amount, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gastos por Pessoa</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
        {persons.map(person => {
          const personExpenses = expensesByPerson[person.id] || 0;
          const percentage = totalExpenses > 0 ? (personExpenses / totalExpenses) * 100 : 0;
          
          return (
            <View key={person.id} style={styles.personCard}>
              <View style={styles.personHeader}>
                <Text style={styles.personName}>{person.name}</Text>
                {person.isOwner && <Text style={styles.ownerBadge}>👑</Text>}
              </View>
              <Text style={styles.amount}>
                {formatCurrency(personExpenses)}
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${Math.min(percentage, 100)}%` }
                  ]} 
                />
              </View>
              <Text style={styles.percentage}>
                {percentage.toFixed(1)}%
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    margin: 16,
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
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 16,
  },
  scrollContainer: {
    flexDirection: 'row',
  },
  personCard: {
    backgroundColor: '#F7FAFC',
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  personHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  personName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
  },
  ownerBadge: {
    marginLeft: 4,
    fontSize: 12,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E53E3E',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4299E1',
    borderRadius: 2,
  },
  percentage: {
    fontSize: 12,
    color: '#718096',
  },
});
