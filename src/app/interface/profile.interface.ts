import { Category } from "./category.interface";

export interface Profile {
    id?: string;
    userId?: string;
    zipcodeId: string;
    address: string;
    imagePersonal?: string;
    introduction: string;
    isBusiness: boolean;
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
    categories: Array<string>;
  }
  
  