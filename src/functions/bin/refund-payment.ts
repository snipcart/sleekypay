import { APIGatewayEvent, Context, Callback } from "aws-lambda";
import uuid from 'uuid';

interface RefundPayload {
  paymentId: string;
  amount: number;
};

exports.handler = async function (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback) {

  const requestBody: RefundPayload = JSON.parse(event.body);
  console.log('requestBody', requestBody)

  console.log(`Refunding ${requestBody.amount}$ on payment ${requestBody.paymentId}.`);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      refundId: uuid(),
    })
  };
}