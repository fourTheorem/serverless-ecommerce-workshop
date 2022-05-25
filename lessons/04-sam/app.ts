/* eslint-disable */
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

const mockGigs = Array.from({ length: 12 }).map((_v, i) => ({
  id: `band${i}-location${i}`,
  bandName: `Mock Band ${i}`,
  city: `Mock City ${i}`,
  year: '1961',
  date: '2019-01-01',
  venue: `Mock Venue ${i}`,
  collectionPointMap: 'map-placeholder.png',
  collectionPoint: 'New York, NY 10001, USA',
  collectionTime: '14:30',
  originalDate: '1977-02-05',
  capacity: 3000,
  description: `Mock description ${i}`,
  image: 'band-placeholder.png',
  price: '1010'
}))

export async function listGigs (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(mockGigs)
  }
}

export async function gig (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> {
  const { id } = event.pathParameters
  const gig = mockGigs.find(gig => gig.id === id)

  if (!gig) {
    return {
      statusCode: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: `Gig "${id}" not found!` })
    }
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(gig)
  }
}
