export interface Category {
  id:          string;
  name:        string;
  description: string;
  statusId:    string;
  urlImage:       string;
  licenseRequired?: boolean;
  createdAt?:   Date;
  updatedAt?:   Date;
  deletedAt?:   null;
  createdBy?:   string;
  updatedBy?:   string;
  deletedBy?:   null;
}