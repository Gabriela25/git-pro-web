import { User } from "./user.interface";


export interface Notification {
  id?: string
  endpoint?: string;
  auth_key?:string;
  p256dh_key?: string;
  userId: string;
  user: User;
  expiration_time?: Date;
  permission: string;
  device:string;
  createdAt?:      Date;
  updatedAt?:      Date;
  deletedAt?:      null;
  createdBy?:      string;
  updatedBy?:      string;
  deletedBy?:      null;
}
