import { Category } from "./category.interface";
import { SubscriptionPayment } from "./subscription-payment.interface";





export interface ProfileCategory {

    id?: string;
    profileId: string;
    categoryId: string;
    status: string;
    stripeSubscriptionId: string | null;
    cancellationRequestedAt: Date | null;
    subscriptionPayments?: SubscriptionPayment[];
    stripeSubscriptionItemId?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
    createdBy?: string;
    updatedBy?: string;
    deletedBy?: string | null;
    category?: Category;
}