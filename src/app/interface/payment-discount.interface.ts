export interface AppliedRule {
  id: string;
  description: string;
  appliesTo: string;
  discountType: string;
  discountValue: string;
}

export interface PaymentDiscount {
  categoryId: string;
  categoryName: string;
  stripePriceId: string;
  basePrice: number;
  discountedPrice: number;
  discountApplied: boolean;
  appliedRule: AppliedRule;
  status?: string; //campo que se llena con el estado del ProfileCategory asociado
}