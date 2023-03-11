import { Context, Callback, APIGatewayEvent } from "aws-lambda";

import { generate } from 'short-uuid';
import { BillingInfo } from '../types/billingInfo';
import { CustomerInfo } from '../types/customerInfo';
import { OrderDetails } from '../types/orderDetails';
import { ShippingInfo } from '../types/shippingInfo';
import { Transaction } from '../types/transaction';

interface TransactionData {
  transaction: Partial<Transaction>;
  billing_info: Partial<BillingInfo>;
  shipping_info: Partial<ShippingInfo>;
  customer_info: Partial<CustomerInfo>;
  order_details: Partial<OrderDetails>;
}
console.log('before payload');

// let requestBody:any;

// export default async function (
//   event: APIGatewayEvent,
//   context: Context,
//   callback: Callback) {
//   requestBody = JSON.parse(event.body);
//   console.log('requestBody', requestBody);
// }

// let requestBody = ({
//   invoice: {
//     amount: "111.50",
//     currency: "USD",
//     billingAddress: {
//       name: "Jan",
//       streetAndNumber: "First Street",
//       city: "Makati",
//       state: "Metro Manila",
//       country: "PH",
//       postalCode: "1227",
//     },
//     shippingAddress: {
//       name: "Jan",
//       streetAndNumber: "First Street",
//       city: "Quezone City",
//       state: "Metro Manila Area",
//       country: "PH",
//       postalCode: "1229",
//     },
//     email: "lymdul@gmail.com"
//   }
// })


// export const transactionData: TransactionData = {

exports.handler = async function (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback) {

  const requestBody = JSON.parse(event.body);
  
  console.log('Transaction Data');
  
  return {
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
      amount: requestBody.invoice.amount,
      currency: requestBody.invoice.currency.toUpperCase(),
      trx_type: "sale",
    },
    billing_info: {
      billing_address1: requestBody.invoice.billingAddress.streetAndNumber,
      billing_address2: "streetAndNumber",
      billing_city: requestBody.invoice.billingAddress.city,
      billing_state: requestBody.invoice.billingAddress.state,
      billing_country: requestBody.invoice.billingAddress.country,
      billing_zip: requestBody.invoice.billingAddress.postalCode
    },
    shipping_info: {
      shipping_address1: requestBody.invoice.shippingAddress.streetAndNumber,
      shipping_address2: "streetAndNumber",
      shipping_city: requestBody.invoice.shippingAddress.city,
      shipping_state: requestBody.invoice.shippingAddress.state,
      shipping_country: requestBody.invoice.shippingAddress.country,
      shipping_zip: requestBody.invoice.shippingAddress.postalCode
    },
    customer_info: {
      fname: requestBody.invoice.billingAddress.name,
      lname: "surname",
      mname: "",
      email: requestBody.invoice.email,
      phone: "09171234567",
      mobile: "09171234567",
      dob: "",
    },
    order_details: {
      orders: [
        {
          itemname: "Test Product",
          quantity: 1,
          unitprice: "101.50",
          totalprice: "101.50"
        },
        {
          itemname: "Convenience Fee",
          quantity: 1,
          unitprice: "10.00",
          totalprice: "10.00",
          servicecharge: true
        }
      ],
      subtotalprice: requestBody.invoice.amount,
      shippingprice: "0.00",
      discountamount: "0.00",
      totalorderamount: requestBody.invoice.amount
    }


    

    // order_details.orders = requestBody.invoice.items.map((item: { name: string; quantity: number; unitPrice: string; amount: string; }) => ({
    //   itemname: item.name,
    //   quantity: item.quantity,
    //   unitprice: item.unitPrice,
    //   totalprice: item.amount
    // }));
    // order_details.subtotalprice = requestBody.invoice.amount;
    // order_details.totalorderamount = requestBody.invoice.amount;


  };
}


console.log('after payload');
