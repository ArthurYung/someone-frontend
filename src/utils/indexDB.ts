import Dexie, { Table } from 'dexie';
import { MessageInfo } from '../api/message';
import { UserInfo } from '../api/user';

export interface MessageDBRow extends MessageInfo{
  id?: number;
}


export class MyMessageDatabase extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  messages!: Table<MessageDBRow>; 
  userInfo!: Table<UserInfo>;

  constructor() {
    super('messageDatabase');
    this.version(1).stores({
      messages: '++id, role, content', // Primary key and indexed props
      userInfo: 'id, user_name',
    });
  }
}

export const historyDB = new MyMessageDatabase();
