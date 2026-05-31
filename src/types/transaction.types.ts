export interface DepositPayload {
  amount: number;
}

export interface TransferMoneyPayload {
  fromAccountNumber: string;
  toAccountNumber: string;
  amount: number;
}
