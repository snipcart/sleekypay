
import { Context, Callback, APIGatewayEvent } from "aws-lambda";
import fetch from "node-fetch";

interface SnipcartPaymentMethod {
  id: string
  name: string;
  checkoutUrl: string;
  iconUrl?: string;
}

if (!process.env.PRODUCTION) {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0' // For local development
}
// console.log('process.env.PRODUCTION', process.env.PRODUCTION);

exports.handler = async function (event: APIGatewayEvent, context: Context, callback: Callback) {
  // Get request's body
//   console.log('event.body', event.body)
  const request = JSON.parse(event.body)
//   console.log('paynamics-method>line 20>request', request)
  const API_URL = process.env.API_URL || 'https://localhost:12666';
  const SITE_URL = process.env.URL || 'http://localhost:3000';

  // Validate that the request is coming from Snipcart
  const response = await fetch(`${API_URL}/api/public/custom-payment-gateway/validate?publicToken=${request.publicToken}`)
//   console.log('paynamics-method>line 27>response', response)
  // Return 404 if the request is not from Snipcart
  if (!response.ok) return {
    statusCode: 404,
    body: ""
  }

  // Create payment method list
  let paymentMethodList: SnipcartPaymentMethod[] = [{
    id: 'paynamics',
    name: 'Paynamics',
    // checkoutUrl: `${SITE_URL}/index.html`,
    checkoutUrl: SITE_URL,
    // iconUrl: `https://paymentrequest-custom-gateway.snipcart.vercel.app/google_pay.png`
  }]

  // Return available payment methods
  return {
    statusCode: 200,
    body: JSON.stringify(paymentMethodList)
  };
}