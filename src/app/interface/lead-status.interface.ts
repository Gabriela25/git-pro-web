import { Category } from "./category.interface";
import { User } from "./user.interface";
import { Zipcode } from "./zipcode.interface";

export interface LeadStatus {
  id?:             string;
  name:            string
  createdAt?:      Date;
  updatedAt?:      Date;
  deletedAt?:      null;
  createdBy?:      string;
  updatedBy?:      string;
  deletedBy?:      null;
}
