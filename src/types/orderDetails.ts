import { Order } from './order';

export interface OrderDetails {
  orders: Partial<Order>[];
  subtotalprice: string;
  shippingprice: string;
  discountamount: string;
  totalorderamount: string;
}