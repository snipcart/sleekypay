import * as React from "react";
import { Status, PaymentSession } from "./interfaces";
import { SHA512, enc } from 'crypto-js'; 
import fetch from 'node-fetch';

console.log('before paynamicsHandler');

exports.handler = async function() {
  console.log('inside paynamicsHandler');
  const [paymentSession, setPaymentSession] = React.useState<PaymentSession>();
  const [status, setStatus] = React.useState<Status>(Status.Loading)

  const PAYNAMICS_ENDPOINT = "https://api.payserv.net/v1/rpf/transactions/rpf";
  const BEARER_TOKEN = process.env.BEARER_TOKEN
  const MERCHANT_ID = process.env.MERCHANT_ID;
  const MKEY = process.env.MKEY;
  const API_URL = process.env.API_URL || 'https://payment.snipcart.com';
    
  const myHeaders = new Headers();
  myHeaders.append("Authorization", "Basic "+ BEARER_TOKEN);
  myHeaders.append("Content-Type", "application/json");

  async function fetchPaymentSession() {
    const jwt = new URLSearchParams(window.location.search).get('publicToken')
    const response = await fetch(`${API_URL}/api/public/custom-payment-gateway/payment-session?publicToken=${jwt}`);

    if (!response.ok) {
      setStatus(Status.Failed)
      return
    }

    setPaymentSession(await response.json())
    setStatus(Status.Loaded)
  }

  React.useEffect(() => { fetchPaymentSession() }, [])

  function toIsoString(date) {
    const pad = function(num) {
      return (num < 10 ? '0' : '') + num;
    };
    return date.getFullYear()
      + pad(date.getMonth() + 1)
      + pad(date.getDate())
      + pad(date.getHours())
      + pad(date.getMinutes())
      + pad(date.getSeconds())
      ;
  }
  const dt = new Date();
  let timestamp = toIsoString(dt);
  // console.log(timestamp);

  let payload = {
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

  const payloadStringified = JSON.stringify(payload);

  let rawTrx =
    MERCHANT_ID +
    payload.transaction.request_id +
    payload.transaction.notification_url +
    payload.transaction.response_url +
    payload.transaction.cancel_url +
    payload.transaction.collection_method +
    payload.transaction.amount +
    payload.transaction.currency +
    payload.transaction.payment_notification_status +
    payload.transaction.payment_notification_channel +
    MKEY;
  let raw =
    payload.customer_info.fname +
    payload.customer_info.lname +
    payload.customer_info.mname +
    payload.customer_info.email +
    payload.customer_info.phone +
    payload.customer_info.mobile +
    payload.customer_info.dob +
    MKEY;

  const signatureTrx = enc.Hex.stringify(SHA512(rawTrx));
  const signature = enc.Hex.stringify(SHA512(raw));
  payload.transaction.signature = signatureTrx;
  payload.customer_info.signature = signature;

  console.log('rawTrx', rawTrx);
  console.log('raw', raw);
  console.log('signatureTrx', payload.transaction.signature);
  console.log('signature', payload.customer_info.signature);
  // console.log('payload', payload);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: payloadStringified,
    // redirect: 'follow'
  };

  fetch(PAYNAMICS_ENDPOINT, requestOptions)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      console.log('inside fetch');
    })
    .catch(error => console.error(error))
}



console.log('after paynamicsHandler');
