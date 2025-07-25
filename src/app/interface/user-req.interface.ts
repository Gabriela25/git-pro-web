import { ProfileReq } from "./profile-req.interface";
import { Profile } from "./profile.interface";

export interface UserReq {
  id?: string;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  phone: string;
  emailVerifiedAt?: string;
  enabled?: boolean;
  logginAttempts?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string | null;
  profile?: ProfileReq;
}
