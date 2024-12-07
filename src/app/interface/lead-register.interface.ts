
export interface LeadRegister {
  id?:             string;
  userId?:         string;
  categoryId:      string;
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
