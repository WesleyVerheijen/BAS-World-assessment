export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: number;
  inactive: boolean;
  created_at: Date;
}

export interface PlainUser {
  id: number;
  name: string;
}

export interface Message {
  id?: number;
  created_at?: Date;
  sender_id?: number;
  recipient_id: number;
  cipher: string;
  expires_at?: Date;
  read: boolean;
  read_once: boolean;
}

export interface PublicKey {
  id?: number;
  created_at?: Date;
  user_id?: number;
  public_key: string;
}

export interface SymetricKey {
  id?: number;
  created_at?: Date;
  sender_id?: number;
  receiver_id: number;
  cypher: string;
  signature: string;
  algo: string;
}