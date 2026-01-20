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
    signingIn: string;
    creatingAccount: string;
    emailRequired: string;
    emailInvalid: string;
    passwordRequired: string;
    passwordMinLength: string;
    passwordConfirmRequired: string;
    passwordsDoNotMatch: string;
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
    actions: string;
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
    savingTransaction: string;
    editCategory: string;
    deleteCategory: string;
    deleteTransactionTooltip: string;
    deleteCategoryTooltip: string;
    systemCategory: string;
    currency: string;
    pageLabel: string;
    pageOf: string;
    previousPage: string;
    nextPage: string;
    date: string;
    time: string;
    addTransaction: string;
    saving: string;
    income: string;
    expense: string;
    createSuccess: string;
    amountRequired: string;
    amountMin: string;
    dateRequired: string;
    timeRequired: string;
    categoryRequired: string;
    categoryNameRequired: string;
    deleteSuccess: string;
    deleteError: string;
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
      signingIn: 'Signing in...',
      creatingAccount: 'Creating account...',
      emailRequired: 'Email is required',
      emailInvalid: 'Invalid email address',
      passwordRequired: 'Password is required',
      passwordMinLength: 'Password must be at least 6 characters',
      passwordConfirmRequired: 'Password confirmation is required',
      passwordsDoNotMatch: 'Passwords do not match',
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
      actions: 'Actions',
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
      savingTransaction: 'Saving transaction...',
      editCategory: 'Edit',
      deleteCategory: 'Delete',
      deleteTransactionTooltip: 'Delete transaction',
      deleteCategoryTooltip: 'Delete category',
      systemCategory: 'System',
      currency: 'Currency',
      pageLabel: 'Page',
      pageOf: 'of',
      previousPage: 'Previous',
      nextPage: 'Next',
      date: 'Date',
      time: 'Time',
      addTransaction: 'Add transaction',
      saving: 'Saving...',
      income: 'Income',
      expense: 'Expense',
      createSuccess: 'Transaction created successfully',
      amountRequired: 'Amount is required',
      amountMin: 'Amount must be greater than 0',
      dateRequired: 'Date is required',
      timeRequired: 'Time is required',
      categoryRequired: 'Category is required',
      categoryNameRequired: 'Name is required',
      deleteSuccess: 'Transaction deleted successfully',
      deleteError: 'Unable to delete transaction',
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
      signingIn: 'Entrando...',
      creatingAccount: 'Criando conta...',
      emailRequired: 'Email é obrigatório',
      emailInvalid: 'Email inválido',
      passwordRequired: 'Senha é obrigatória',
      passwordMinLength: 'A senha deve ter pelo menos 6 caracteres',
      passwordConfirmRequired: 'Confirmação de senha é obrigatória',
      passwordsDoNotMatch: 'As senhas não conferem',
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
      actions: 'Ações',
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
      savingTransaction: 'Salvando transação...',
      editCategory: 'Editar',
      deleteCategory: 'Excluir',
      deleteTransactionTooltip: 'Excluir transação',
      deleteCategoryTooltip: 'Excluir categoria',
      systemCategory: 'Sistema',
      currency: 'Moeda',
      pageLabel: 'Página',
      pageOf: 'de',
      previousPage: 'Anterior',
      nextPage: 'Próxima',
      date: 'Data',
      time: 'Hora',
      addTransaction: 'Adicionar transação',
      saving: 'Salvando...',
      income: 'Entrada',
      expense: 'Saída',
      createSuccess: 'Transação criada com sucesso',
      amountRequired: 'Valor é obrigatório',
      amountMin: 'O valor deve ser maior que 0',
      dateRequired: 'Data é obrigatória',
      timeRequired: 'Hora é obrigatória',
      categoryRequired: 'Categoria é obrigatória',
      categoryNameRequired: 'Nome é obrigatório',
      deleteSuccess: 'Transação excluída com sucesso',
      deleteError: 'Não foi possível excluir a transação',
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
