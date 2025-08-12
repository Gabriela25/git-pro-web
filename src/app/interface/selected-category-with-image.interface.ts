import { Category } from './category.interface'; 

export interface SelectedCategoryWithImage {
  category: Category; 
  uploadedImageBase64?: string | ArrayBuffer | null; 
  uploadedImageFile?: File | null;
  title: string,
  mimetype: string; 

  status: string;
  stripeSubscriptionId: string | null;
  cancellationRequestedAt: Date | null;
  
}