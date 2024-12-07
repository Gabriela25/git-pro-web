import { Category } from "./category.interface";
import { User } from "./user.interface";
import { Zipcode } from "./zipcode.interface";

export interface Lead {
  id?:             string;
  userId?:         string;
  user?:           User;
  category:        Category;
  categoryId:      string;
  zipcode:         Zipcode;
  zipcodeId:       string;
  phone:           string;
  description:     string;
  images:          string;
  qtyPro?:         number;
  createdAt?:      Date;
  updatedAt?:      Date;
  deletedAt?:      null;
  createdBy?:      string;
  updatedBy?:      string;
  deletedBy?:      null;
}
