export interface OrderStatus {
  id?:          string;
  name:        string;
  description?: string;
  createdAt?:   Date;
  updatedAt?:   Date;
  deletedAt?:   null;
  createdBy?:   string;
  updatedBy?:   string;
  deletedBy?:   null;
}