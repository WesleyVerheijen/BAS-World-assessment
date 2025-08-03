import * as React from 'react';
import { IUser } from '../api/IUser';
import { Page } from '../utils/Page';
import { IPlainUser } from '../api/IPlainUser';
import { IPublicKey } from '../api/IPublicKey';
import { IMessage } from '../api/IMessage';

export type OrderContextType = {
  error: string | null;
  userName: string | null;
  user: IUser | null;
  userSignedIn: boolean;
  users: IPlainUser[];
  setUser(user: IUser | null): void;
  setBack(page: Page, productId?: number): void;
  handleBack(): void;
  setCorrespondentId(id: number): void;
  correspondentPublicKey: IPublicKey | null;
  sendMessage(message: IMessage): void;
  readMessage(message: IMessage): void;
  messages: IMessage[];
  loadMessages(): void;
  decryptMessages(messages: IMessage[]): Promise<IMessage[]>;
};

export const OrderContext = React.createContext<Partial<OrderContextType>>({});