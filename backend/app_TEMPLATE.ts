import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

export async function listGigs (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify([])
  }
}

export async function gig (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({})
  }
}

export async function purchase (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({})
  }
}
