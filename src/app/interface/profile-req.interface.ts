import { Category } from "./category.interface";
import { License } from "./license.interace";
import { ProfileCategory } from "./profile-category.interface";

export interface ProfileReq {
    id?: string;
    userId?: string;
    zipcodeIds: [];
    address: string;
    imagePersonal?: string;
    introduction: string;
    isBusiness?: boolean;
    nameBusiness?: string | null;
    yearFounded?: number | null;
    numberOfemployees?: number | null;
    imageBusiness?: string | null;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
    createdBy?: string;
    updatedBy?: string;
    deletedBy?: string | null;
    licenses?: Array<License>;
    categoryIds: Array<string>; 
    status?: string;

  }
  
  