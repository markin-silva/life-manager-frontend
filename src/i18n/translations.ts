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
    uncategorized: string;
    categoryPlaceholder: string;
    createCategory: string;
    manageCategories: string;
    categoryName: string;
    categoryColor: string;
    categoryIcon: string;
    saveCategory: string;
    savingCategory: string;
    editCategory: string;
    deleteCategory: string;
    systemCategory: string;
    date: string;
    time: string;
    addTransaction: string;
    saving: string;
    income: string;
    expense: string;
  };
  categories: Record<string, string>;
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
      noTransactions: 'No transactions yet. Add your first entry with the button above.',
      amount: 'Amount',
      kind: 'Kind',
      description: 'Description',
      category: 'Category',
      uncategorized: 'Uncategorized',
      categoryPlaceholder: 'Select a category',
      createCategory: 'Create category',
      manageCategories: 'Manage categories',
      categoryName: 'Name',
      categoryColor: 'Color',
      categoryIcon: 'Icon',
      saveCategory: 'Save category',
      savingCategory: 'Saving category...',
      editCategory: 'Edit',
      deleteCategory: 'Delete',
      systemCategory: 'System',
      date: 'Date',
      time: 'Time',
      addTransaction: 'Add transaction',
      saving: 'Saving...',
      income: 'Income',
      expense: 'Expense',
    },
    categories: {
      food: 'Food',
      housing: 'Housing',
      transport: 'Transport',
      shopping: 'Shopping',
      education: 'Education',
      leisure: 'Leisure',
      health: 'Health',
      salary: 'Salary',
      travel: 'Travel',
      entertainment: 'Entertainment',
      investments: 'Investments',
      bills: 'Bills',
      utilities: 'Utilities',
      groceries: 'Groceries',
      coffee: 'Coffee',
      fitness: 'Fitness',
      gifts: 'Gifts',
      pets: 'Pets',
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
      noTransactions: 'Nenhuma transação ainda. Adicione a primeira pelo botão acima.',
      amount: 'Valor',
      kind: 'Tipo',
      description: 'Descrição',
      category: 'Categoria',
      uncategorized: 'Sem categoria',
      categoryPlaceholder: 'Selecione uma categoria',
      createCategory: 'Criar categoria',
      manageCategories: 'Gerenciar categorias',
      categoryName: 'Nome',
      categoryColor: 'Cor',
      categoryIcon: 'Ícone',
      saveCategory: 'Salvar categoria',
      savingCategory: 'Salvando categoria...',
      editCategory: 'Editar',
      deleteCategory: 'Excluir',
      systemCategory: 'Sistema',
      date: 'Data',
      time: 'Hora',
      addTransaction: 'Adicionar transação',
      saving: 'Salvando...',
      income: 'Entrada',
      expense: 'Saída',
    },
    categories: {
      food: 'Alimentação',
      housing: 'Casa',
      transport: 'Transporte',
      shopping: 'Compras',
      education: 'Educação',
      leisure: 'Lazer',
      health: 'Saúde',
      salary: 'Salário',
      travel: 'Viagens',
      entertainment: 'Entretenimento',
      investments: 'Investimentos',
      bills: 'Contas',
      utilities: 'Serviços',
      groceries: 'Mercado',
      coffee: 'Café',
      fitness: 'Academia',
      gifts: 'Presentes',
      pets: 'Pets',
    },
  },
};
