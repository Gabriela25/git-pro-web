export interface SubscriptionPayment {
    id: string;
    profileCategoryId: string;
    stripeInvoiceId: string;
    paidAt: Date;
    startsAt: Date;
    endsAt: Date;
    amount: number;
    discountPercent?: number;
    discountAmount?: number;
    urlInvoice: string;
}