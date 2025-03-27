
import { LeadStatus } from "./lead-status.interface";

export interface LeadRequest {
  id?:             string;
  leadId?:         string;
  userId?:         string;
  leadStatusId?:    string;
  leadStatus?:      LeadStatus;
  createdAt?:      Date;
  updatedAt?:      Date;
  deletedAt?:      null;
  createdBy?:      string;
  updatedBy?:      string;
  deletedBy?:      null;
}
