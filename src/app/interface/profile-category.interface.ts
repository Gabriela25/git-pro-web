import { Category } from "./category.interface";



export interface ProfileCategory {

    id?: string;
    profileId: string;
    categoryId: string;
    isActive: boolean;
    stripeSubscriptionId: string | null;
    cancellationRequestedAt: Date | null;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
    createdBy?: string;
    updatedBy?: string;
    deletedBy?: string | null;
    category?: Category;
}