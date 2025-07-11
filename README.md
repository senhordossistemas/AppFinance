# 💰 ShareWallet - Carteira Compartilhada

Um aplicativo React Native inovador para controle de finanças pessoais com a funcionalidade única de **atribuir transações a diferentes pessoas**, mesmo quando você usa seu próprio cartão ou conta.

## � Funcionalidade Principal Diferencial

**Problema Resolvido:** "Comprei algo para minha esposa/filho/amigo usando meu cartão, mas quero registrar que a despesa é dele, não minha."

**Solução ShareWallet:** Permite vincular qualquer transação feita com seus cartões/contas a qualquer pessoa cadastrada, mantendo o controle real de gastos por pessoa.

### 📱 Funcionalidades Gerais

- ✅ Lançamento de receitas e despesas
- ✅ Múltiplas contas bancárias e cartões
- ✅ Categorização inteligente de transações
- ✅ Saldos atualizados automaticamente
- ✅ Interface moderna e intuitiva
- ✅ Armazenamento local com SQLite
- ✅ Funciona offline

## 🚀 Tecnologias Utilizadas

- **React Native** com **TypeScript**
- **Expo** para desenvolvimento e build
- **React Navigation** para navegação
- **SQLite** para banco de dados local
- **React Hook Form** para formulários
- **AsyncStorage** para configurações

## 📦 Instalação e Execução

### Pré-requisitos

- Node.js (versão 18 ou superior)
- Expo CLI
- Emulador Android/iOS ou dispositivo físico

### Passos para executar

1. **Clone e instale dependências:**

   ```bash
   cd AppFinance
   npm install
   ```

2. **Execute o projeto:**

   ```bash
   npm start
   # ou
   npx expo start
   ```

3. **Execute no dispositivo:**
   - **Android**: `npm run android` ou escaneie o QR code com o app Expo Go
   - **iOS**: `npm run ios` ou escaneie o QR code com a câmera
   - **Web**: `npm run web`

## 📱 Como Usar

### 1. **Adicionar Pessoas**
- Vá em "Nova Pessoa"
- Adicione familiares, amigos ou colegas
- O app automaticamente identifica você como proprietário

### 2. **Configurar Contas**
- Adicione suas contas bancárias e cartões
- Configure saldos iniciais (opcional)
- Organize por banco e tipo

### 3. **Lançar Transações**
- **Descrição**: O que foi comprado/recebido
- **Valor**: Quanto custou
- **Categoria**: Alimentação, transporte, etc.
- **Conta**: Qual cartão/conta foi usado
- **✨ Para quem é**: Atribua a despesa à pessoa responsável
- **Pago por**: Quem efetivamente usou o cartão (padrão: você)

### 4. **Visualizar Relatórios**
- Veja gastos totais por pessoa
- Acompanhe percentuais individuais
- Monitore saldos de contas

## 🎯 Casos de Uso

### Família
- Pais comprando para filhos
- Cônjuges dividindo despesas
- Controle de mesada e gastos

### Grupos
- Viagens em grupo
- Repúblicas estudantis
- Colegas de trabalho

### Empresarial
- Despesas de funcionários
- Reembolsos corporativos
- Controle de adiantamentos

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── TransactionCard.tsx
│   └── PersonSummary.tsx
├── contexts/           # Context API para estado global
│   └── AppContext.tsx
├── navigation/         # Configuração de navegação
│   └── AppNavigator.tsx
├── screens/           # Telas do aplicativo
│   ├── HomeScreen.tsx
│   ├── AddTransactionScreen.tsx
│   ├── AddPersonScreen.tsx
│   └── AddAccountScreen.tsx
├── services/          # Serviços e integrações
│   └── database.ts
├── types/             # Definições TypeScript
│   └── index.ts
└── utils/             # Utilitários e helpers
    └── helpers.ts
```

## 🔄 Próximos Passos

### Funcionalidades Planejadas
- [ ] Relatórios gráficos avançados
- [ ] Exportação de dados (PDF/Excel)
- [ ] Backup na nuvem (Firebase/Supabase)
- [ ] Notificações push
- [ ] Modo escuro
- [ ] Múltiplas moedas
- [ ] Transações recorrentes
- [ ] Metas e orçamentos
- [ ] Divisão automática de contas
- [ ] Scanner de notas fiscais

### Melhorias Técnicas
- [ ] Testes unitários
- [ ] Testes E2E
- [ ] CI/CD pipeline
- [ ] Performance optimization
- [ ] Accessibility improvements

## 🤝 Contribuindo

Este é um projeto pessoal, mas sugestões e feedback são sempre bem-vindos!

## 📄 Licença

Este projeto é para fins educacionais e pessoais.

---

**Desenvolvido com ❤️ usando React Native + Expo**

*A principal diferença deste app está na capacidade de atribuir despesas a pessoas específicas, resolvendo o problema comum de não saber "de quem é" cada gasto quando se usa cartões compartilhados.*
