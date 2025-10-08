import { Category } from './category.interface'; 

export interface SelectedCategoryWithImage {
  category: Category; 
  uploadedImageBase64?: string | ArrayBuffer | null; 
  uploadedImageFile?: File | null;
  title: string,
  mimetype: string; 
  filename?: string | null;
  status: string;
  stripeSubscriptionItemId: string | null;
  cancellationRequestedAt: Date | null;
  
}