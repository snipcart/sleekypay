import React, { useEffect, useState } from 'react';
// import { useEffect } from 'react';
import './App.css';
// import { transactionData } from './data/transactionData';
// import { useTransaction } from './hooks/useTransaction';
import { Status, PaymentSession } from "./interfaces";
import Form from "./components/Form";

function App() {
  // const {
  //   create,
  //   loading,
  //   response,
  // } = useTransaction();

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

  useEffect(() => { fetchPaymentSession() }, [])

  function getContentByStatus(status: Status) {
    switch (status) {
      case Status.Failed:
        return <div className="app__notice">Failed to retrieve invoice, please try again later.</div>
      case Status.Loaded:
        console.log('invoice', paymentSession.invoice)
        console.log('paymentSessionId', paymentSession.id)
        // create(transactionData)
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
    <div className="App">
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
