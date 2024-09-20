import { Profile } from "./profile.interface";
export interface Payment {
  id?:             string;
  userId?:         string;
  serviceId:      string;
  amount:         string;
  paymentMethod:  string;
  status:         string;
  reference:      string;
  activationDate?: Date;
  expirationDate?: Date;
  createdAt?:      Date;
  updatedAt?:      Date;
  deletedAt?:      null;
  createdBy?:      string;
  updatedBy?:      string;
  deletedBy?:      null;
}
