export interface Person {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  isOwner: boolean; // Indica se é o proprietário principal da conta
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'debit';
  bankName?: string;
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
  parentId?: string; // Para subcategorias
  isActive: boolean;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  accountId: string;
  assignedToPersonId: string; // FUNCIONALIDADE PRINCIPAL: A quem a transação é atribuída
  paidByPersonId: string; // Quem efetivamente pagou (proprietário da conta/cartão)
  date: Date;
  notes?: string;
  isRecurring: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  attachments?: string[]; // URLs ou paths para comprovantes
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  id: string;
  name: string;
  categoryId: string;
  amount: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface RecurrentTransaction {
  id: string;
  transactionTemplate: Omit<Transaction, 'id' | 'date' | 'createdAt' | 'updatedAt'>;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextExecutionDate: Date;
  isActive: boolean;
}

export type TransactionFormData = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>;
export type PersonFormData = Omit<Person, 'id' | 'createdAt' | 'updatedAt'>;
export type AccountFormData = Omit<Account, 'id' | 'createdAt' | 'updatedAt'>;
