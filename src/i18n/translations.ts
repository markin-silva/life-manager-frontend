export type Locale = 'en' | 'pt-BR';

type Translations = {
  common: {
    appName: string;
    logout: string;
    dashboard: string;
    transactions: string;
    balance: string;
    loading: string;
    delete: string;
    items: string;
  };
  auth: {
    createAccount: string;
    signInToAccount: string;
    yourEmail: string;
    password: string;
    confirmPassword: string;
    signIn: string;
    createAccountButton: string;
    alreadyHaveAccount: string;
    loginHere: string;
    dontHaveAccount: string;
    signUp: string;
  };
  dashboard: {
    title: string;
    body: string;
    openTransactions: string;
  };
  transactions: {
    title: string;
    subtitle: string;
    newTransaction: string;
    recentActivity: string;
    noTransactions: string;
    amount: string;
    kind: string;
    description: string;
    category: string;
    date: string;
    time: string;
    addTransaction: string;
    saving: string;
    income: string;
    expense: string;
  };
};

export const translations: Record<Locale, Translations> = {
  en: {
    common: {
      appName: 'Life Manager',
      logout: 'Logout',
      dashboard: 'Dashboard',
      transactions: 'Transactions',
      balance: 'Balance',
      loading: 'Loading...',
      delete: 'Delete',
      items: 'items',
    },
    auth: {
      createAccount: 'Create an account',
      signInToAccount: 'Sign in to your account',
      yourEmail: 'Your email',
      password: 'Password',
      confirmPassword: 'Confirm password',
      signIn: 'Sign in',
      createAccountButton: 'Create an account',
      alreadyHaveAccount: 'Already have an account?',
      loginHere: 'Login here',
      dontHaveAccount: "Don’t have an account?",
      signUp: 'Sign up',
    },
    dashboard: {
      title: 'Welcome to your dashboard',
      body: 'This is your home base. Financial tracking features are coming soon.',
      openTransactions: 'Open transactions',
    },
    transactions: {
      title: 'Transactions',
      subtitle: 'Track your income and expenses in one place.',
      newTransaction: 'New transaction',
      recentActivity: 'Recent activity',
      noTransactions: 'No transactions yet. Add your first entry on the left.',
      amount: 'Amount',
      kind: 'Kind',
      description: 'Description',
      category: 'Category',
      date: 'Date',
      time: 'Time',
      addTransaction: 'Add transaction',
      saving: 'Saving...',
      income: 'Income',
      expense: 'Expense',
    },
  },
  'pt-BR': {
    common: {
      appName: 'Life Manager',
      logout: 'Sair',
      dashboard: 'Dashboard',
      transactions: 'Transações',
      balance: 'Saldo',
      loading: 'Carregando...',
      delete: 'Excluir',
      items: 'itens',
    },
    auth: {
      createAccount: 'Criar conta',
      signInToAccount: 'Entrar na sua conta',
      yourEmail: 'Seu email',
      password: 'Senha',
      confirmPassword: 'Confirmar senha',
      signIn: 'Entrar',
      createAccountButton: 'Criar conta',
      alreadyHaveAccount: 'Já tem uma conta?',
      loginHere: 'Fazer login',
      dontHaveAccount: 'Não tem uma conta?',
      signUp: 'Criar conta',
    },
    dashboard: {
      title: 'Bem-vindo ao seu dashboard',
      body: 'Este é seu ponto inicial. Em breve você terá recursos de finanças.',
      openTransactions: 'Abrir transações',
    },
    transactions: {
      title: 'Transações',
      subtitle: 'Acompanhe suas entradas e saídas em um só lugar.',
      newTransaction: 'Nova transação',
      recentActivity: 'Atividade recente',
      noTransactions: 'Nenhuma transação ainda. Adicione a primeira à esquerda.',
      amount: 'Valor',
      kind: 'Tipo',
      description: 'Descrição',
      category: 'Categoria',
      date: 'Data',
      time: 'Hora',
      addTransaction: 'Adicionar transação',
      saving: 'Salvando...',
      income: 'Entrada',
      expense: 'Saída',
    },
  },
};
