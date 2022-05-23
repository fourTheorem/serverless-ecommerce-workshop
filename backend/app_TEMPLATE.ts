import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

export async function listGigs (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> {
  // 1. get the list of gigs
  // 2. return an http lambda proxy response
  //    with the list of gigs.
  //    The body of the response is a JSON object that contains
  //    a property `gigs` which is the array of all the available gigs
  // bonus: handle possible errors
  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify([])
  }
}

export async function gig (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> {
  // 1. get the list of gigs
  // 2. search the gig with the ID coming from `event.pathParameters.id`
  // 3. if no gig is found return a 404 response
  // 4. if the gig is found return it as body of a lambda proxy response.
  // bonus: handle possible errors
  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({})
  }
}
