import { Order } from "./order.interface";


export interface Review  {
  id?:string;
  rating: number;
  comment?: string;
  order: Order
  orderId: string, 
  clientId: string;
  proId:string
}