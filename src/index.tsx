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
        return <Form invoice={paymentSession.invoice} paymentSessionId={paymentSession.id} />
      case Status.Loading:
        return <div className="app__notice">Preparing order...</div>
    }
  }

  return (
    <div className="app">
      <div className="app__body">
        <h1 className="app__title">SleekyPay</h1>
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
}

const rootNode = document.getElementById("root")
ReactDOM.render(<App />, rootNode)

