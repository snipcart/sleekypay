
import uuid from "uuid"
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { getResultPayload } from "../helpers";


if (!process.env.PRODUCTION) {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0' // For local development
}

exports.handler = async function (event: APIGatewayEvent): Promise<APIGatewayProxyResult> {

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: ''
    }
  }

  return getResultPayload(
    event,
    {
      refundId: uuid()
    });
}