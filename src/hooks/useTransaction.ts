import { useState } from 'react';
import { Auth } from '../adapters/paynamics/auth/Auth';
import { client } from '../adapters/paynamics/client';
import { BillingInfo } from '../types/billingInfo';
import { CustomerInfo } from '../types/customerInfo';
import { OrderDetails } from '../types/orderDetails';
import { ShippingInfo } from '../types/shippingInfo';
import { Transaction } from '../types/transaction';

interface TransactionCreatePayload {
  transaction: Partial<Transaction>;
  billing_info: Partial<BillingInfo>;
  shipping_info: Partial<ShippingInfo>;
  customer_info: Partial<CustomerInfo>;
  order_details: Partial<OrderDetails>;
}

// TODO: Should only be keys of `Transaction`
const transactionFieldOrder: string[] = [
  'request_id',
  'notification_url',
  'response_url',
  'cancel_url',
  'pmethod',
  'collection_method',
  'amount',
  'currency',
  'payment_notification_status',
  'payment_notification_channel',
]
// TODO: Should only be keys of `CustomerInfo`
const customerInfoFieldOrder: string[] = [
  'fname',
  'lname',
  'mname',
  'email',
  'phone',
  'mobile',
  'amount',
  'dob',
]

export const useTransaction = () => {
  const RESOURCE = 'transactions/rpf';
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any | null>(null)

  const create = async ({
    transaction: { trx_type, ...transaction },
    customer_info,
    ...payload
  }: TransactionCreatePayload) => {
    setLoading(true);
    try {
      const response = await client(
        RESOURCE,
        'POST',
        {
          transaction: {
            ...transaction,
            trx_type,
            signature: Auth.signWithMerchantId(transaction, transactionFieldOrder)
          },
          customer_info: {
            ...customer_info,
            signature: Auth.sign(customer_info, customerInfoFieldOrder)
          },
          ...payload,
        },
        undefined,
      );
      setResponse(response)
    } catch (e) {
      // TODO: Handle errors
    }
    setLoading(false);
  }

  return { create, loading, response }
}