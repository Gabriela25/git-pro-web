import { OrderList } from "./order-list.interface";
import { Order } from "./order.interface";

export interface Lead {
  id:         string;
  userId:     string;
  order:      OrderList;
  orderId:    string;
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
