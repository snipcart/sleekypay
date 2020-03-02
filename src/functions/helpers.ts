import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

export function getResultPayload(
  event: APIGatewayEvent,
  fallbackBody: {}): APIGatewayProxyResult {
  const statusCodeString = event.queryStringParameters['statusCode'];

  if (statusCodeString) {
    const statusCode = parseInt(statusCodeString, 10)
    if (statusCode > 299) {
      return {
        statusCode,
        body: ''
      }
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(fallbackBody)
  }
}