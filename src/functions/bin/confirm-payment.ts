import { Context, Callback, APIGatewayEvent } from "aws-lambda";
import fetch from 'node-fetch';
import uuid from 'uuid';

if (!process.env.PRODUCTION) {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0' // For local development
}

exports.handler = async function (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback) {
  interface ConfirmResult {
    returnUrl: string;
  }

  const requestBody = JSON.parse(event.body);
  const paymentId = uuid();

  const API_URL = process.env.API_URL || 'https://localhost:12666';
  const SITE_URL = process.env.URL || event.headers.origin;

  const response = await fetch(
    `${API_URL}/api/private/custom-payment-gateway/payment`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      paymentSessionId: requestBody.paymentSessionId,
      state: requestBody.state,
      error: requestBody.error,
      transactionId: paymentId,
      instructions: 'Your payment will appear on your statement in the coming days',
      links: {
        refunds: `${SITE_URL}/.netlify/functions/refund-payment?transactionId=${paymentId}`,
      }
    }),
  });

  if (response.ok) {
    const body = (await response.json()) as ConfirmResult;

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, returnUrl: body.returnUrl })
    };
  }
}