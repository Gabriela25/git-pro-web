import { profile } from 'console';
import { Profile } from './profile.interface';
import { Category } from './category.interface';


export interface License {
  id: string;
  profileId: string;
  profile ?: Profile;
  category?: Category;
  categoryId?: string;
  url: string;
  filename?: string;
  mimetype?: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  createdBy: string;
  updatedBy: string;
  deletedBy?: string | null;
}

