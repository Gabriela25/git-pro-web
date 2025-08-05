import { Category } from "./category.interface";
import { License } from "./license.interace";
import { ProfileCategory } from "./profile-category.interface";

export interface Profile {
    id?: string;
    userId?: string;
    zipcodeId: string;
    address: string;
    imagePersonal?: string;
    introduction: string;
    isBusiness?: boolean;
    nameBusiness?: string | null;
    yearFounded?: number | null;
    numberOfemployees?: number | null;
    imageBusiness?: string | null;
    licenses?: Array<License>;
    profileCategories: Array<ProfileCategory>; 
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
    createdBy?: string;
    updatedBy?: string;
    deletedBy?: string | null;
   

  }
  
  