export interface CreateAccountPayload {
  accountType: "SAVINGS" | "CURRENT" | "SALARY";
}

export interface Account {
  id: number;
  account_number: string;
  account_type: "SAVINGS" | "CURRENT" | "SALARY";
  balance: number;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface DepositPayload {
  amount: number;
}
