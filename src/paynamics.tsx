import { SHA512, enc } from 'crypto-js'; 
import fetch from 'node-fetch';

const PAYNAMICS_ENDPOINT = process.env.PAYNAMICS_ENDPOINT || "https://api.payserv.net/v1/rpf/transactions/rpf";
const BEARER_TOKEN = process.env.BEARER_TOKEN
const MERCHANT_ID = process.env.MERCHANT_ID;
const MKEY = process.env.MKEY;
const API_URL = process.env.API_URL || 'https://payment.snipcart.com';
  
console.log(PAYNAMICS_ENDPOINT)
console.log(BEARER_TOKEN)
console.log(MERCHANT_ID)
console.log(MKEY)
console.log(API_URL)
console.log('before paynamicsHandler');

interface TransactionPayload {
  transaction: {
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
    signature: string;
  };
  billing_info: {
    billing_address1: string;
    billing_address2: string;
    billing_city: string;
    billing_state: string;
    billing_country: string;
    billing_zip: string;
  };
  shipping_info: {
    shipping_address1: string;
    shipping_address2: string;
    shipping_city: string;
    shipping_state: string;
    shipping_country: string;
    shipping_zip: string;
  };
  customer_info: {
    fname: string;
    lname: string;
    mname: string;
    email: string;
    phone: string;
    mobile: string;
    dob: string;
    signature: string;
  };
  order_details: {
    orders: {
      itemname: string;
      quantity: number;
      unitprice: string;
      totalprice: string;
      service_charge?: boolean;
    }[];
    subtotalprice: string;
    shippingprice: string;
    discountamount: string;
    totalorderamount: string;
  };
}

function toIsoString(date: Date) {
  const pad = function (num: number) {
    return (num < 10 ? "0" : "") + num;
  };
  return (
    date.getFullYear() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
}
let dt = new Date();
let timestamp = toIsoString(dt);


    const transactionPayload: TransactionPayload = {
      "transaction": {
        "request_id": "PNXD-T-RPF-"+ timestamp,
        "notification_url": "/notif_url",
        "response_url": "/response_url",
        "cancel_url": "/experience",
        "pchannel": "",
        "pmethod": "",
        "collection_method": "single_pay",
        "payment_notification_status": "1",
        "payment_notification_channel": "1",
        "amount": "111.50",
        "currency": "USD",
        "trx_type": "sale",
        "signature": ""
      },
      "billing_info": {
        "billing_address1": "First Street",
        "billing_address2": "H.V. dela Costa Street",
        "billing_city": "Makati",
        "billing_state": "Metro Manila",
        "billing_country": "PH",
        "billing_zip": "1227"
      },
      "shipping_info": {
        "shipping_address1": "First Street",
        "shipping_address2": "",
        "shipping_city": "Quezon City",
        "shipping_state": "Metro Manila Area",
        "shipping_country": "PH",
        "shipping_zip": "1229"
      },
      "customer_info": {
        "fname": "Jan",
        "lname": "Dae",
        "mname": "",
        "email": "lymdul@gmail.com",
        "phone": "09171234567",
        "mobile": "09171234567",
        "dob": "",
        "signature": ""
      },
      "order_details": {
        "orders": [
          {
            "itemname": "Test Product",
            "quantity": 1,
            "unitprice": "101.50",
            "totalprice": "101.50"
          },
          {
            "itemname": "Convenience Fee",
            "quantity": 1,
            "unitprice": "10.00",
            "totalprice": "10.00",
            "service_charge": true
          }
        ],
        "subtotalprice": "111.50",
        "shippingprice": "0.00",
        "discountamount": "0.00",
        "totalorderamount": "111.50"
      }
    }

    const payloadStringified = JSON.stringify(transactionPayload);

    let rawTrx =
      MERCHANT_ID +
      transactionPayload.transaction.request_id +
      transactionPayload.transaction.notification_url +
      transactionPayload.transaction.response_url +
      transactionPayload.transaction.cancel_url +
      transactionPayload.transaction.collection_method +
      transactionPayload.transaction.amount +
      transactionPayload.transaction.currency +
      transactionPayload.transaction.payment_notification_status +
      transactionPayload.transaction.payment_notification_channel +
      MKEY;
    let raw =
      transactionPayload.customer_info.fname +
      transactionPayload.customer_info.lname +
      transactionPayload.customer_info.mname +
      transactionPayload.customer_info.email +
      transactionPayload.customer_info.phone +
      transactionPayload.customer_info.mobile +
      transactionPayload.customer_info.dob +
      MKEY;

    const signatureTrx = enc.Hex.stringify(SHA512(rawTrx));
    const signature = enc.Hex.stringify(SHA512(raw));
    transactionPayload.transaction.signature = signatureTrx;
    transactionPayload.customer_info.signature = signature;

    console.log('rawTrx', rawTrx);
    console.log('raw', raw);
    console.log('signatureTrx', transactionPayload.transaction.signature);
    console.log('signature', transactionPayload.customer_info.signature);
    // console.log('transactionPayload', transactionPayload);


    fetch(PAYNAMICS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: payloadStringified,
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('fetch success')
      console.log(data);
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });




console.log('after paynamicsHandler');
