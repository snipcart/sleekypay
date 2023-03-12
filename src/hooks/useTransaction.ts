import { useState } from 'react';
import { Auth } from '../adapters/paynamics/auth/Auth';
import { client } from '../adapters/paynamics/client';
import { TransactionPayload } from '../types/paynamics/transactionPayload';

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
  const [error, setError] = useState<any | null>(null)

  const create = async ({
    transaction: { trx_type, ...transaction },
    customer_info,
    ...payload
  }: TransactionPayload) => {
    setLoading(true);
    try {
      const response = await client(
        `${RESOURCE}`,
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
      setError(e)
    }
    setLoading(false);
  }

  return { create, loading, response, error }
}