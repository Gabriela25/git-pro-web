export interface OrderAcceptedInfo {
  id: string;
  fullname: string;
  description: string;
  phone: string;
  zipcode: string;
  category: string;
  images: string[];
  orderLimitReached: boolean;
}