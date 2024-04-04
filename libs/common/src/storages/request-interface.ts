export interface IRequestStorage {
  reset: () => void;
  resetTransactionDepth: () => void;
  increaseTransactionDepth: () => void;
  decreaseTransactionDepth: () => void;
  setRequestId: (requestId: string) => void;
}
