import { Lead } from "./lead.interface";
import { StatusOrder } from "./status-order.interface";
import { User } from "./user.interface";



export interface Order {
  id:          string;
  userId:      string;
  user:        User;
  lead:        Lead;
  leadId:      string;
  assigned:    boolean;
  comment?:    string;
  statusOrderId: string;
  statusOrder: StatusOrder
  createdAt?:  Date;
  updatedAt?:  Date;
  deletedAt?:  null;
  createdBy?:  string;
  updatedBy?:  string;
  deletedBy?:  null;
}
