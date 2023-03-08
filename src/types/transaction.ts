export interface Transaction {
  request_id: string;
  notification_url: string;
  response_url: string;
  cancel_url: string;
  pchannel: string;
  pmethod: string;
  collection_method: string;
  payment_notification_status: string;
  payment_notification_channel: string;
  amount: string;
  currency: string;
  trx_type: string;
}