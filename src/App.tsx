import React, { useEffect, useState } from 'react';
import { useTransaction } from './hooks/useTransaction';
import { PaymentSession } from "./interfaces";

import { invoiceToTransaction } from './adapters/paynamics/mappers/snipcart/invoiceToTransaction';

function App() {
  const {
    create,
    response,
  } = useTransaction();

  const [paymentSession, setPaymentSession] = useState<PaymentSession>();
  const [hasErrors, setHasErrors] = useState(false)
  const [loading, setLoading] = useState(false)

  async function fetchPaymentSession() {
    const jwt = new URLSearchParams(window.location.search).get('publicToken')
    const API_URL = process.env.API_URL || 'https://localhost:12666';
    const response = await fetch(`${API_URL}/api/public/custom-payment-gateway/payment-session?publicToken=${jwt}`);

    setLoading(true);

    if (!response.ok) {
      setHasErrors(true);
      setLoading(false);
      return
    }

    const parsedResponse = await response.json()
    setPaymentSession(parsedResponse)
    create(invoiceToTransaction(parsedResponse.invoice))
  }

  useEffect(() => { fetchPaymentSession() }, []);

  // TODO: Refactor to not use `useEffect`
  useEffect(() => {
    if(!!response?.redirect_url) {
      window.location.replace(response.redirect_url)
    }
  }, [response])

  return (
    <div className="app">
      {hasErrors ? (
        <div className="app__notice">Failed to retrieve invoice, please try again later.</div>
      ) : loading ? (
          <div className="app__notice">Preparing order...</div>
      ) : <></>}
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
