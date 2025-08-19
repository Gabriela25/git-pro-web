import { Order } from "./order.interface";
import { User } from "./user.interface";


export interface Review  {
  id?:string;
  rating: number;
  comment?: string;
  order: Order
  orderId: string, 
  client?: User;
  clientId: string;
  proId:string
}