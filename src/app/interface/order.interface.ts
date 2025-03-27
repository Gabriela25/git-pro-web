import { Lead } from "./lead.interface";
import { OrderStatus } from "./order-status.interface";
import { User } from "./user.interface";



export interface Order {
  id:          string;
  userId:      string;
  user:        User;
  lead:        Lead;
  leadId:      string;
  assigned:    boolean;
  comment?:    string;
  orderStatusId: string;
  orderStatus: OrderStatus
  createdAt?:  Date;
  updatedAt?:  Date;
  deletedAt?:  null;
  createdBy?:  string;
  updatedBy?:  string;
  deletedBy?:  null;
}
