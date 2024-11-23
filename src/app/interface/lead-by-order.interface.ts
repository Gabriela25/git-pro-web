import { profile } from "console";
import { Order } from "./order.interface";
import { User } from "./user.interface";

export interface LeadByOrder {
  id:         string;
  userId:     string;
  user:       User; 
  orderId:    string;
  order:      Order;
  assigned:   boolean;
  comment?:    string;
  statusLead?: string;
  createdAt?:  Date;
  updatedAt?:  Date;
  deletedAt?:  null;
  createdBy?:  string;
  updatedBy?:  string;
  deletedBy?:  null;
}
