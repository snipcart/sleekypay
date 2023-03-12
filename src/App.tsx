import React, { useEffect, useState } from 'react';
// import { useEffect } from 'react';
// import './App.css';
// import { transactionData } from './data/transactionData';
import { useTransaction } from './hooks/useTransaction';
import { Status, PaymentSession } from "./interfaces";
// import Form from "./components/Form";
import { generate } from 'short-uuid';

import { BillingInfo } from './types/billingInfo';
import { CustomerInfo } from './types/customerInfo';
import { OrderDetails } from './types/orderDetails';
import { ShippingInfo } from './types/shippingInfo';
import { Transaction } from './types/transaction';

interface TransactionData {
  transaction: Partial<Transaction>;
  billing_info: Partial<BillingInfo>;
  shipping_info: Partial<ShippingInfo>;
  customer_info: Partial<CustomerInfo>;
  order_details: Partial<OrderDetails>;
}


function App() {
  const {
    create,
    loading,
    response,
  } = useTransaction();

  const [paymentSession, setPaymentSession] = useState<PaymentSession>();
  const [status, setStatus] = useState<Status>(Status.Loading)

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

/** /
  const handleClick = () => {
    // TODO: Update with actual data
    create(transactionData)
  }
/**/
  // useEffect(() => {
  //   create(transactionData);
  // }, []);

  useEffect(() => { fetchPaymentSession() }, []);
  

  function getContentByStatus(status: Status) {
    switch (status) {
      case Status.Failed:
        return <div className="app__notice">Failed to retrieve invoice, please try again later.</div>
      case Status.Loaded:
        useEffect(() => {
          if (paymentSession) {
            let paymentSessionData: TransactionData = {
              transaction: {
                request_id: generate(),
                notification_url: "https://www.paynamics.com/notify",
                response_url: "https://www.paynamics.com/response",
                cancel_url: paymentSession?.paymentAuthorizationRedirectUrl,
                pchannel: "",
                pmethod: "",
                collection_method: "single_pay",
                payment_notification_status: "1",
                payment_notification_channel: "1",
                amount: paymentSession.invoice.amount,
                currency: paymentSession.invoice.currency,
                trx_type: "sale",
              },
              billing_info: {
                billing_address1: paymentSession.invoice.billingAddress.streetAndNumber,
                billing_address2: "test",
                billing_city: paymentSession.invoice.billingAddress.city,
                billing_state: paymentSession.invoice.billingAddress.region,
                billing_country: paymentSession.invoice.billingAddress.country,
                billing_zip: paymentSession.invoice.billingAddress.postalCode
              },
              shipping_info: {
                shipping_address1: paymentSession.invoice.shippingAddress.streetAndNumber,
                shipping_address2: "test",
                shipping_city: paymentSession.invoice.shippingAddress.city,
                shipping_state: paymentSession.invoice.shippingAddress.region,
                shipping_country: paymentSession.invoice.shippingAddress.country,
                shipping_zip: paymentSession.invoice.shippingAddress.postalCode
              },
              customer_info: {
                fname: paymentSession.invoice.billingAddress.name,
                lname: "surname",
                mname: "middlename",
                email: paymentSession.invoice.email,
                phone: "1234567890",
                mobile: "1234567890",
                dob: "",
              },
              order_details: {
                orders: [
                  {
                    itemname: "Test product",
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
                subtotalprice: "111.50",
                shippingprice: "0.00",
                discountamount: "0.00",
                totalorderamount: "111.50"
              }
            };
            create(paymentSessionData);
          }
        }, [paymentSession]);
        console.log('paymentSession', paymentSession);
      case Status.Loading:
        return <div className="app__notice">Preparing order...</div>
    }
  }

  // TODO: Refactor to not use `useEffect`
  // useEffect(() => {
  //   if(!!response?.redirect_url) {
  //     window.location.replace(response.redirect_url)
  //   }
  // }, [response])

  return (
    <div className="app">
      {getContentByStatus(status)}
      <footer className="app__footer">
        <a href={paymentSession?.paymentAuthorizationRedirectUrl || ""} className="link">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.013 512.013"><path d="M512.013 240.086H54.573l132.64-132.64-22.56-22.72-160 160c-6.204 6.241-6.204 16.319 0 22.56l160 160 22.56-22.56-132.64-132.64h457.44v-32z" /></svg>
          Go back to store
        </a>
      </footer>
    </div>
  );
}

export default App;
