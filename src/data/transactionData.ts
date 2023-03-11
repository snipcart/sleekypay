import { generate } from 'short-uuid';

import { BillingInfo } from '../types/billingInfo';
import { CustomerInfo } from '../types/customerInfo';
import { OrderDetails } from '../types/orderDetails';
import { ShippingInfo } from '../types/shippingInfo';
import { Transaction } from '../types/transaction';
import { Context, Callback, APIGatewayEvent } from "aws-lambda";

interface TransactionData {
  transaction: Partial<Transaction>;
  billing_info: Partial<BillingInfo>;
  shipping_info: Partial<ShippingInfo>;
  customer_info: Partial<CustomerInfo>;
  order_details: Partial<OrderDetails>;
}

console.log('before payload');
export let transactionData: TransactionData = {
  transaction: {
    request_id: generate(),
    notification_url: "https://www.paynamics.com/notify",
    response_url: "https://www.paynamics.com/response",
    cancel_url: "https://www.paynamics.com/cancel",
    pchannel: "",
    pmethod: "",
    collection_method: "single_pay",
    payment_notification_status: "1",
    payment_notification_channel: "1",
    amount: "",
    currency: "",
    trx_type: "",
  },
  billing_info: {
    billing_address1: "",
    billing_address2: "",
    billing_city: "",
    billing_state: "",
    billing_country: "",
    billing_zip: ""
  },
  shipping_info: {
    shipping_address1: "",
    shipping_address2: "",
    shipping_city: "",
    shipping_state: "",
    shipping_country: "",
    shipping_zip: ""
  },
  customer_info: {
    fname: "",
    lname: "",
    mname: "",
    email: "",
    phone: "",
    mobile: "",
    dob: "",
  },
  order_details: {
    orders: [
      {
        itemname: "",
        quantity: 0,
        unitprice: "",
        totalprice: ""
      }
    ],
    subtotalprice: "",
    shippingprice: "",
    discountamount: "",
    totalorderamount: ""
  }
}

console.log('Pristine Transaction Data:', transactionData);

export const handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
  try {
    const invoice = await JSON.parse(event.body!).invoice;
    console.log('invoice', invoice);
    
    // Populate transactionData fields with invoice values
    const txn = transactionData.transaction;
    const billing_info = transactionData.billing_info;
    const shipping_info = transactionData.shipping_info;
    const customer_info = transactionData.customer_info;
    const order_details = transactionData.order_details;

    txn.amount = invoice.amount;
    txn.currency = invoice.currency.toUpperCase();
    txn.trx_type = "sale";
    
    billing_info.billing_address1 = invoice.billingAddress.streetAndNumber;
    billing_info.billing_city = invoice.billingAddress.city;
    billing_info.billing_country = invoice.billingAddress.country;
    billing_info.billing_zip = invoice.billingAddress.postalCode;

    shipping_info.shipping_address1 = invoice.shippingAddress.streetAndNumber;
    shipping_info.shipping_city = invoice.shippingAddress.city;
    shipping_info.shipping_country = invoice.shippingAddress.country;
    shipping_info.shipping_zip = invoice.shippingAddress.postalCode;

    customer_info.fname = invoice.email.split('@')[0];
    customer_info.email = invoice.email;
    customer_info.phone = invoice.phoneNumber;
    
    order_details.orders = invoice.items.map((item: { name: any; quantity: any; unitPrice: any; amount: any; }) => ({
      itemname: item.name,
      quantity: item.quantity,
      unitprice: item.unitPrice,
      totalprice: item.amount
    }));
    order_details.subtotalprice = invoice.amount;
    order_details.totalorderamount = invoice.amount;

    console.log('Updated Transaction Data:', transactionData);

  } catch(e){
    console.error(e);
  }

}

console.log('after payload');

