import { BillingAddress } from './billingAddress';
import { Item } from './item';
import { ShippingAddress } from './shippingAddress';

export interface Invoice {
  amount: number;
  // TODO: Update to not be partial. making everything optional for now
  billingAddress: Partial<BillingAddress>;
  currency: string;
  email: string;
  items: Partial<Item>[];
  language: string;
  // TODO: Update to not be partial. making everythihng optional for now
  shippingAddress: Partial<ShippingAddress>;
  targetId: string;
}