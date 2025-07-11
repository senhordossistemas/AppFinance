import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Transaction, Person, Account, Category } from '../types';
import { databaseService } from '../services/database';

interface AppContextType {
  // Estado
  isLoading: boolean;
  transactions: Transaction[];
  persons: Person[];
  accounts: Account[];
  categories: Category[];
  
  // Funções
  refreshData: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  addPerson: (person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  addAccount: (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  getTransactionsByPerson: (personId: string) => Promise<Transaction[]>;
  getTotalBalance: () => number;
  getExpensesByPerson: () => { [personId: string]: number };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setIsLoading(true);
      await databaseService.initDatabase();
      await refreshData();
    } catch (error) {
      console.error('Erro ao inicializar app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      console.log('=== DEBUG AppContext refreshData ===');
      const [transactionsData, personsData, accountsData, categoriesData] = await Promise.all([
        databaseService.getTransactions(),
        databaseService.getPersons(),
        databaseService.getAccounts(),
        databaseService.getCategories(),
      ]);

      console.log('Dados carregados:');
      console.log('- Transactions:', transactionsData.length);
      console.log('- Persons:', personsData.length, personsData);
      console.log('- Accounts:', accountsData.length, accountsData);
      console.log('- Categories:', categoriesData.length, categoriesData);

      setTransactions(transactionsData);
      setPersons(personsData);
      setAccounts(accountsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await databaseService.createTransaction(transaction);
      await refreshData(); // Recarrega todos os dados para manter consistência
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      throw error;
    }
  };

  const addPerson = async (person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await databaseService.createPerson(person);
      await refreshData();
    } catch (error) {
      console.error('Erro ao criar pessoa:', error);
      throw error;
    }
  };

  const addAccount = async (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await databaseService.createAccount(account);
      await refreshData();
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      throw error;
    }
  };

  const getTransactionsByPerson = async (personId: string): Promise<Transaction[]> => {
    try {
      return await databaseService.getTransactionsByPerson(personId);
    } catch (error) {
      console.error('Erro ao buscar transações por pessoa:', error);
      return [];
    }
  };

  const getTotalBalance = (): number => {
    return accounts.reduce((total, account) => total + account.balance, 0);
  };

  const getExpensesByPerson = (): { [personId: string]: number } => {
    const expensesByPerson: { [personId: string]: number } = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const personId = transaction.assignedToPersonId;
        if (!expensesByPerson[personId]) {
          expensesByPerson[personId] = 0;
        }
        expensesByPerson[personId] += transaction.amount;
      });

    return expensesByPerson;
  };

  const contextValue: AppContextType = {
    isLoading,
    transactions,
    persons,
    accounts,
    categories,
    refreshData,
    addTransaction,
    addPerson,
    addAccount,
    getTransactionsByPerson,
    getTotalBalance,
    getExpensesByPerson,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
}
