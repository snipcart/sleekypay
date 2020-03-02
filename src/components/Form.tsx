import * as React from "react";
import Cleave from "cleave.js"
import { Invoice } from "../interfaces";
import Summary from "./Summary"

interface PaymentState {
  state: string,
  error: {
    code: string;
    message?: string;
  } | null;
}

interface FromProps {
  invoice: Invoice,
  paymentSessionId: string,
}

export default function Form({ invoice, paymentSessionId }: FromProps) {

  const [paymentState, setPaymentState] = React.useState<PaymentState>({
    state: 'processed',
    error: null
  });

  function getErrorFromCode(
    code: string) {
    if (!code)
      return null;

    if (!paymentState.error) {
      return { code }
    }

    return {
      code,
      message: paymentState.error.message
    }
  }

  function getErrorFromMessage(message: string) {

    if (!paymentState.error) {
      return null;
    }

    return {
      message,
      code: paymentState.error.code
    }
  }

  React.useEffect(() => {
    new Cleave(".form__input--number", { creditCard: true })
    new Cleave('.form__input--expiry', { date: true, datePattern: ['m', 'y'] });
  }, [])

  async function submitHandler(event: React.FormEvent) {
    event.preventDefault();

    const response = await fetch('/.netlify/functions/confirm-payment', {
      method: 'POST',
      body: JSON.stringify({
        paymentSessionId: paymentSessionId,
        state: paymentState.state,
        error: paymentState.state == 'failed' ? paymentState.error : null
      })
    });

    const body = await response.json();

    window.location.href = body.returnUrl;
  }

  return (
    <form action="" className="form" onSubmit={submitHandler}>
      <Summary {...invoice} />
      <div className="form__container">
        <input className="form__input form__input--number" type="text" placeholder="Card Numbers" />
        <input className="form__input form__input--expiry" type="text" placeholder="MM/YY" />
        <input className="form__input form__input--cvv" type="text" placeholder="CVV" maxLength={4} />
        <select
          className="form__input  form__input--state"
          value={paymentState.state}
          onChange={e => setPaymentState({ ...paymentState, state: e.target.value })}>

          <option value="processing">Processing</option>
          <option value="processed">Processed</option>
          <option value="failed">Failed</option>
        </select>
        {paymentState && paymentState.state == 'failed' &&
          <input
            className="form__input"
            type="text"
            required
            placeholder="error_code"
            value={paymentState.error && paymentState.error.code}
            onChange={e => setPaymentState({ ...paymentState, error: getErrorFromCode(e.target.value) })} />
        }
        {paymentState && paymentState.state == 'failed' &&
          <input
            className="form__input"
            type="text"
            placeholder="Error msg."
            value={paymentState.error && paymentState.error.message}
            onChange={e => setPaymentState({ ...paymentState, error: getErrorFromMessage(e.target.value) })} />
        }
        <button className="form__button">Complete order</button>
      </div>
    </form>
  )
}