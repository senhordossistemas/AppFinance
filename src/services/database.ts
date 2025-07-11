import * as SQLite from 'expo-sqlite';
import { Transaction, Person, Account, Category } from '../types';

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initDatabase() {
    if (this.db) return;
    
    this.db = await SQLite.openDatabaseAsync('appfinance.db');
    
    try {
      // Tabela de pessoas
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS persons (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT,
          avatar TEXT,
          isOwner INTEGER NOT NULL DEFAULT 0,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        );
      `);

      // Tabela de contas/cartões
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS accounts (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          type TEXT NOT NULL CHECK (type IN ('checking', 'savings', 'credit', 'debit')),
          bankName TEXT,
          balance REAL NOT NULL DEFAULT 0,
          currency TEXT NOT NULL DEFAULT 'BRL',
          isActive INTEGER NOT NULL DEFAULT 1,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        );
      `);

      // Tabela de categorias
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          icon TEXT NOT NULL,
          color TEXT NOT NULL,
          type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
          parentId TEXT,
          isActive INTEGER NOT NULL DEFAULT 1,
          FOREIGN KEY (parentId) REFERENCES categories (id)
        );
      `);

      // Tabela de transações
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS transactions (
          id TEXT PRIMARY KEY,
          description TEXT NOT NULL,
          amount REAL NOT NULL,
          type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
          categoryId TEXT NOT NULL,
          accountId TEXT NOT NULL,
          assignedToPersonId TEXT NOT NULL,
          paidByPersonId TEXT NOT NULL,
          date TEXT NOT NULL,
          notes TEXT,
          isRecurring INTEGER NOT NULL DEFAULT 0,
          recurringFrequency TEXT,
          attachments TEXT,
          tags TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          FOREIGN KEY (categoryId) REFERENCES categories (id),
          FOREIGN KEY (accountId) REFERENCES accounts (id),
          FOREIGN KEY (assignedToPersonId) REFERENCES persons (id),
          FOREIGN KEY (paidByPersonId) REFERENCES persons (id)
        );
      `);

      // Inserir pessoa padrão (proprietário)
      await this.db.runAsync(`
        INSERT OR IGNORE INTO persons (id, name, isOwner, createdAt, updatedAt)
        VALUES ('owner', 'Você', 1, datetime('now'), datetime('now'));
      `);

      // Inserir conta padrão
      await this.db.runAsync(`
        INSERT OR IGNORE INTO accounts (id, name, type, bankName, balance, currency, isActive, createdAt, updatedAt)
        VALUES ('default-account', 'Conta Principal', 'checking', '', 0, 'BRL', 1, datetime('now'), datetime('now'));
      `);

      // Inserir categorias padrão
      await this.insertDefaultCategories();
      
      console.log('Banco de dados inicializado com sucesso');
    } catch (error) {
      console.error('Erro ao inicializar banco:', error);
      throw error;
    }
  }

  private async insertDefaultCategories() {
    const defaultCategories = [
      // Despesas
      { id: 'food', name: 'Alimentação', icon: '🍽️', color: '#FF6B6B', type: 'expense' },
      { id: 'transport', name: 'Transporte', icon: '🚗', color: '#4ECDC4', type: 'expense' },
      { id: 'health', name: 'Saúde', icon: '🏥', color: '#45B7D1', type: 'expense' },
      { id: 'education', name: 'Educação', icon: '📚', color: '#96CEB4', type: 'expense' },
      { id: 'entertainment', name: 'Entretenimento', icon: '🎬', color: '#FFEAA7', type: 'expense' },
      { id: 'shopping', name: 'Compras', icon: '🛒', color: '#DDA0DD', type: 'expense' },
      { id: 'bills', name: 'Contas', icon: '📋', color: '#74B9FF', type: 'expense' },
      
      // Receitas
      { id: 'salary', name: 'Salário', icon: '💼', color: '#00B894', type: 'income' },
      { id: 'freelance', name: 'Freelance', icon: '💻', color: '#FDCB6E', type: 'income' },
      { id: 'investment', name: 'Investimentos', icon: '📈', color: '#6C5CE7', type: 'income' },
      { id: 'gift', name: 'Presente', icon: '🎁', color: '#FD79A8', type: 'income' },
    ];

    for (const category of defaultCategories) {
      await this.db!.runAsync(
        `INSERT OR IGNORE INTO categories (id, name, icon, color, type, isActive)
         VALUES (?, ?, ?, ?, ?, 1)`,
        [category.id, category.name, category.icon, category.color, category.type]
      );
    }
  }

  // Métodos para Pessoas
  async createPerson(person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = Date.now().toString();
    const now = new Date().toISOString();
    
    await this.db!.runAsync(
      `INSERT INTO persons (id, name, email, avatar, isOwner, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, person.name, person.email || '', person.avatar || '', person.isOwner ? 1 : 0, now, now]
    );
    
    return id;
  }

  async getPersons(): Promise<Person[]> {
    const result = await this.db!.getAllAsync<any>(
      'SELECT * FROM persons ORDER BY isOwner DESC, name ASC'
    );
    
    return result.map(row => ({
      ...row,
      isOwner: Boolean(row.isOwner),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }));
  }

  // Métodos para Contas
  async createAccount(account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = Date.now().toString();
    const now = new Date().toISOString();
    
    await this.db!.runAsync(
      `INSERT INTO accounts (id, name, type, bankName, balance, currency, isActive, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, account.name, account.type, account.bankName || '', account.balance, account.currency, account.isActive ? 1 : 0, now, now]
    );
    
    return id;
  }

  async getAccounts(): Promise<Account[]> {
    const result = await this.db!.getAllAsync<any>(
      'SELECT * FROM accounts WHERE isActive = 1 ORDER BY name ASC'
    );
    
    return result.map(row => ({
      ...row,
      isActive: Boolean(row.isActive),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }));
  }

  // Métodos para Categorias
  async getCategories(): Promise<Category[]> {
    const result = await this.db!.getAllAsync<any>(
      'SELECT * FROM categories WHERE isActive = 1 ORDER BY type, name ASC'
    );
    
    return result.map(row => ({
      ...row,
      isActive: Boolean(row.isActive),
    }));
  }

  // Métodos para Transações
  async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = Date.now().toString();
    const now = new Date().toISOString();
    
    await this.db!.runAsync(
      `INSERT INTO transactions (
        id, description, amount, type, categoryId, accountId, 
        assignedToPersonId, paidByPersonId, date, notes, 
        isRecurring, recurringFrequency, attachments, tags, 
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, transaction.description, transaction.amount, transaction.type,
        transaction.categoryId, transaction.accountId, transaction.assignedToPersonId,
        transaction.paidByPersonId, transaction.date.toISOString(), transaction.notes || '',
        transaction.isRecurring ? 1 : 0, transaction.recurringFrequency || '',
        JSON.stringify(transaction.attachments || []), JSON.stringify(transaction.tags || []),
        now, now
      ]
    );

    // Atualizar saldo da conta
    await this.updateAccountBalance(transaction.accountId, transaction.amount, transaction.type);
    
    return id;
  }

  private async updateAccountBalance(accountId: string, amount: number, type: 'income' | 'expense') {
    const multiplier = type === 'income' ? 1 : -1;
    const balanceChange = amount * multiplier;

    await this.db!.runAsync(
      'UPDATE accounts SET balance = balance + ?, updatedAt = datetime("now") WHERE id = ?',
      [balanceChange, accountId]
    );
  }

  async getTransactions(limit: number = 50, offset: number = 0): Promise<Transaction[]> {
    const result = await this.db!.getAllAsync<any>(
      `SELECT t.*, c.name as categoryName, c.icon as categoryIcon, 
              a.name as accountName, p1.name as assignedToName, p2.name as paidByName
       FROM transactions t
       LEFT JOIN categories c ON t.categoryId = c.id
       LEFT JOIN accounts a ON t.accountId = a.id
       LEFT JOIN persons p1 ON t.assignedToPersonId = p1.id
       LEFT JOIN persons p2 ON t.paidByPersonId = p2.id
       ORDER BY t.date DESC, t.createdAt DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return result.map(row => ({
      id: row.id,
      description: row.description,
      amount: row.amount,
      type: row.type,
      categoryId: row.categoryId,
      accountId: row.accountId,
      assignedToPersonId: row.assignedToPersonId,
      paidByPersonId: row.paidByPersonId,
      date: new Date(row.date),
      notes: row.notes,
      isRecurring: Boolean(row.isRecurring),
      recurringFrequency: row.recurringFrequency,
      attachments: JSON.parse(row.attachments || '[]'),
      tags: JSON.parse(row.tags || '[]'),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
      // Campos adicionais para exibição
      categoryName: row.categoryName,
      categoryIcon: row.categoryIcon,
      accountName: row.accountName,
      assignedToName: row.assignedToName,
      paidByName: row.paidByName,
    }));
  }

  async getTransactionsByPerson(personId: string, limit: number = 50): Promise<Transaction[]> {
    const result = await this.db!.getAllAsync<any>(
      `SELECT t.*, c.name as categoryName, c.icon as categoryIcon, 
              a.name as accountName, p1.name as assignedToName, p2.name as paidByName
       FROM transactions t
       LEFT JOIN categories c ON t.categoryId = c.id
       LEFT JOIN accounts a ON t.accountId = a.id
       LEFT JOIN persons p1 ON t.assignedToPersonId = p1.id
       LEFT JOIN persons p2 ON t.paidByPersonId = p2.id
       WHERE t.assignedToPersonId = ?
       ORDER BY t.date DESC, t.createdAt DESC
       LIMIT ?`,
      [personId, limit]
    );

    return result.map(row => ({
      id: row.id,
      description: row.description,
      amount: row.amount,
      type: row.type,
      categoryId: row.categoryId,
      accountId: row.accountId,
      assignedToPersonId: row.assignedToPersonId,
      paidByPersonId: row.paidByPersonId,
      date: new Date(row.date),
      notes: row.notes,
      isRecurring: Boolean(row.isRecurring),
      recurringFrequency: row.recurringFrequency,
      attachments: JSON.parse(row.attachments || '[]'),
      tags: JSON.parse(row.tags || '[]'),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
      categoryName: row.categoryName,
      categoryIcon: row.categoryIcon,
      accountName: row.accountName,
      assignedToName: row.assignedToName,
      paidByName: row.paidByName,
    }));
  }
}

export const databaseService = new DatabaseService();
