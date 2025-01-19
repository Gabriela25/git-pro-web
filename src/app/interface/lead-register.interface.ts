
export interface LeadRegister {
  id?:             string;
  userId?:         string;
  categoryId:      string;
  zipcodeId:       string;
  phone:           string;
  description:     string;
  imageUrl1:       string;
  imageUrl2:       string;
  imageUrl3:       string;
  imageUrl4:       string;
  imageUrl5:       string;
  imageUrl6:       string;
  statusOrder?:     string;
  qtyPro?:          number;
  createdAt?:      Date;
  updatedAt?:      Date;
  deletedAt?:      null;
  createdBy?:      string;
  updatedBy?:      string;
  deletedBy?:      null;
}
