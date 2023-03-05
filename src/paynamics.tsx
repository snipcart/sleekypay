import * as React from "react";
import * as ReactDOM from "react-dom";
import { Status, PaymentSession } from "./interfaces";
import Form from "./components/Form";

function App() {
  const [paymentSession, setPaymentSession] = React.useState<PaymentSession>();
  const [status, setStatus] = React.useState<Status>(Status.Loading)

  async function fetchPaymentSession() {
    const jwt = new URLSearchParams(window.location.search).get('publicToken')
    const API_URL = process.env.API_URL || 'https://localhost:12666';
    const response = await fetch(`${API_URL}/api/public/custom-payment-gateway/payment-session?publicToken=${jwt}`);

    if (!response.ok) {
      setStatus(Status.Failed)
      return
    }

    setPaymentSession(await response.json())
    setStatus(Status.Loaded)
  }

  React.useEffect(() => { fetchPaymentSession() }, [])

  function getContentByStatus(status: Status) {
    switch (status) {
      case Status.Failed:
        return <div className="app__notice">Failed to retrieve invoice, please try again later.</div>
      case Status.Loaded:
        // return <Form invoice={paymentSession.invoice} paymentSessionId={paymentSession.id} />
        sendPaynamicsData(paymentSession.invoice, paymentSession.id)
      case Status.Loading:
        return <div className="app__notice">Preparing order...</div>
    }
  }
  /** /
  return (
    <div className="app">
      <div className="app__body">
        <h1 className="app__title">Paynamics</h1>
        <h2 className="app__subtitle">Smooth online transactions</h2>
        {getContentByStatus(status)}
      </div>
      <footer className="app__footer">
        <a href={paymentSession?.paymentAuthorizationRedirectUrl || ""} className="link">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.013 512.013"><path d="M512.013 240.086H54.573l132.64-132.64-22.56-22.72-160 160c-6.204 6.241-6.204 16.319 0 22.56l160 160 22.56-22.56-132.64-132.64h457.44v-32z" /></svg>
          Go back to store
        </a>
      </footer>
    </div>
  )
  /**/

// const rootNode = document.getElementById("root")
// ReactDOM.render(<App />, rootNode)




  async function sendPaynamicsData(paymentInvoice: Invoice, paymentSessionId: string) {
    var PAYNAMICS_ENDPOINT = "https://api.payserv.net/v1/rpf/transactions/rpf";
    var BEARER_TOKEN = "YWNjZXNzVHJ2TDQ6M25CNjdPWkZxZ2g0"

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic "+ BEARER_TOKEN);
    myHeaders.append("Content-Type", "application/json");

    function toIsoString(date) {
      var pad = function(num) {
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
    var dt = new Date();
    let timestamp = toIsoString(dt);
    // console.log(timestamp);

    // var mode = 'test';

    var payload = {
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


    var payloadStringified = JSON.stringify(payload);


    // var jsonData = JSON.parse(payload);
    var merchantid = '000000021122575A1796';
    var mkey = 'F6857B71681EF7E482F30B251558AADF';


    var rawTrx =
      merchantid +
      payload.transaction.request_id +
      payload.transaction.notification_url +
      payload.transaction.response_url +
      payload.transaction.cancel_url +
      payload.transaction.collection_method +
      payload.transaction.amount +
      payload.transaction.currency +
      payload.transaction.payment_notification_status +
      payload.transaction.payment_notification_channel +
      mkey;
    var raw =
      payload.customer_info.fname +
      payload.customer_info.lname +
      payload.customer_info.mname +
      payload.customer_info.email +
      payload.customer_info.phone +
      payload.customer_info.mobile +
      payload.customer_info.dob +
      mkey;

    async function sha512(str) {
    let encoder = new TextEncoder();
    let data = encoder.encode(str);
    let hash = await crypto.subtle.digest("SHA-512", data);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    }

    payload.transaction.signature = await sha512(rawTrx);
    payload.customer_info.signature = await sha512(raw);

    console.log('rawTrx', rawTrx);
    console.log('raw', raw);
    console.log('signatureTrx', payload.transaction.signature);
    console.log('signature', payload.customer_info.signature);
    // console.log('payload', payload);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: payloadStringified,
      redirect: 'follow'
    };


    fetch(PAYNAMICS_ENDPOINT, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

}