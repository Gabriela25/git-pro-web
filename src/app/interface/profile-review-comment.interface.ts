



export interface ProfileReviewComment {
  profileId: string;
  adminId?: string;
  comment: string;
  licenseId?: string;
  statusProfile: string;
  createdAt?: Date;
}