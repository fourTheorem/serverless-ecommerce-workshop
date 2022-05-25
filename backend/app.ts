import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

// TODO ... statically generate a list of mock gigs here

export async function listGigs (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      // Note: we need the following header as we'll be calling this API from a frontend in another domain
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify([]) // TODO ... change this to return the list of gigs instead
  }
}

export async function gig (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> {
  // TODO ... extract the id parameter from the event (it will be a key under `pathParameters`)
  // TODO ... use the id to find the current gig in the list of mock gigs
  // TODO ... if you can't find it return a 404 HTTP error response

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({}) // TODO ... change this to return the gig found by id
  }
}
