import { profile } from "console";

import { User } from "./user.interface";
import { LeadRegister } from "./lead-register.interface";


export interface OrderByLead {
  id:          string;
  userId:      string;
  user:        User; 
  orderId:     string;
  lead:        LeadRegister;
  assigned:    boolean;
  comment?:    string;
  statusLead?: string;
  createdAt?:  Date;
  updatedAt?:  Date;
  deletedAt?:  null;
  createdBy?:  string;
  updatedBy?:  string;
  deletedBy?:  null;
}
