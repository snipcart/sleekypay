import { BillingInfo } from './billingInfo';
import { CustomerInfo } from './customerInfo';
import { OrderDetails } from './orderDetails';
import { ShippingInfo } from './shippingInfo';
import { Transaction } from './transaction';

export interface TransactionPayload {
  transaction: Partial<Transaction>;
  billing_info: Partial<BillingInfo>;
  shipping_info: Partial<ShippingInfo>;
  customer_info: Partial<CustomerInfo>;
  order_details: Partial<OrderDetails>;
}
