export type LoadingAction = 'signIn' | 'signUp' | 'saveTransaction';

type Translator = (key: string) => string;

const actionKeyMap: Record<LoadingAction, string> = {
  signIn: 'auth.signingIn',
  signUp: 'auth.creatingAccount',
  saveTransaction: 'transactions.savingTransaction',
};

export const getLoadingLabel = (t: Translator, action: LoadingAction) => {
  return t(actionKeyMap[action]);
};
