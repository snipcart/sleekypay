import React, { useEffect, useState } from 'react';
import { useTransaction } from './hooks/useTransaction';
import { PaymentSession, Status } from "./interfaces";

import { invoiceToTransaction } from './adapters/paynamics/mappers/snipcart/invoiceToTransaction';

function App() {
  const {
    create,
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

    const parsedResponse = await response.json()
    setPaymentSession(parsedResponse)
    setStatus(Status.Loaded)

    create(invoiceToTransaction(parsedResponse.invoice))
  }

  useEffect(() => { fetchPaymentSession() }, []);

  // TODO: Refactor to not use `useEffect`
  useEffect(() => {
    if(!!response?.redirect_url) {
      window.location.replace(response.redirect_url)
    }
  }, [response])


  function getContentByStatus(status: Status) {
    switch (status) {
      case Status.Failed:
        return <div className="app__notice">Failed to retrieve invoice, please try again later.</div>
      case Status.Loaded:
        return <h1>Loaded!</h1>
      case Status.Loading:
        return <div className="app__notice">Preparing order...</div>
    }
  }


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
