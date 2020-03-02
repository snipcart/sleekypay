export interface ShippingAddress {
  name: string;
  surname: string;
  streetAndNumber: string;
  postalCode: string;
  country: string;
  city: string;
  region?: any;
}

export interface BillingAddress {
  name: string;
  surname: string;
  streetAndNumber: string;
  postalCode: string;
  country: string;
  city: string;
  region?: any;
}

export interface Item {
  name: string;
  unitPrice: number;
  quantity: number;
  type: string;
  discountAmount: number;
  rateOfTaxIncludedInPrice: number;
  amount: number;
}

export interface Invoice {
  shippingAddress: ShippingAddress;
  billingAddress: BillingAddress;
  email: string;
  language: string;
  currency: string;
  amount: number;
  targetId: string;
  items: Item[];
}

export interface AvailablePaymentMethod {
  id: string;
  flow: string;
  name: string;
  checkoutUrl: string;
}

export interface Authorization {
  flow: string;
  confirmationSynchronicity: string;
  state: string;
  stateDescriptorCode?: any;
  url: string;
  card?: any;
}

export interface PaymentSession {
  invoice: Invoice;
  state: string;
  availablePaymentMethods: AvailablePaymentMethod[];
  id: string;
  paymentMethod: string;
  paymentAuthorizationRedirectUrl: string;
  authorization: Authorization;
}


export enum Status {
  Loading = 'loading',
  Loaded = 'loaded',
  Failed = 'Failed',
}