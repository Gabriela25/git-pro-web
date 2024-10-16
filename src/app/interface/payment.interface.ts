import { Profile } from "./profile.interface";
export interface Payment {
  id?:             string;
  userId?:         string;
  serviceId:      string;
  amount:         number;
  paymentMethod:  string;
  status:         string;
  reference:      string;
  surplus?:         number;
  activationDate?: Date;
  expirationDate?: Date;
  createdAt?:      Date;
  updatedAt?:      Date;
  deletedAt?:      null;
  createdBy?:      string;
  updatedBy?:      string;
  deletedBy?:      null;
}
