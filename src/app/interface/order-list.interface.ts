import { Category } from "./category.interface";
import { Zipcode } from "./zipcode.interface";

export interface OrderList {
  id?:             string;
  userId?:         string;
  category:        Category;
  categoryId:      string;
  zipcode:         Zipcode;
  zipcodeId:       string;
  phone:           string;
  description:     string;
  images:          string;
  statusOrder?:     string;
  qtyPro?:          number;
  createdAt?:      Date;
  updatedAt?:      Date;
  deletedAt?:      null;
  createdBy?:      string;
  updatedBy?:      string;
  deletedBy?:      null;
}
