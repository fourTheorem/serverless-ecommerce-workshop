import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument, ScanCommand, GetCommand } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({})
const docClient = DynamoDBDocument.from(client)

export async function listGigs (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> {
  const command = new ScanCommand({
    TableName: 'gig'
  })

  try {
    const result = await docClient.send(command)
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result.Items)
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Could not fetch data from database' })
    }
  }
}

export async function gig (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> {
  const { id } = event.pathParameters

  const command = new GetCommand({
    TableName: 'gig',
    Key: { id }
  })

  try {
    const result = await client.send(command)
    if (!result.Item) {
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
      body: JSON.stringify(result.Item)
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Could not fetch data from database' })
    }
  }
}

type BuyTicketFormData = {
  gigId: string,
  name: string,
  email: string,
  nameOnCard: string,
  cardNumber: string,
  cardExpiryMonth: string,
  cardExpiryYear: string,
  cardCVC: string,
  disclaimerAccepted: boolean,
}

export async function purchase (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> {
  let data: BuyTicketFormData

  try {
    data = JSON.parse(event.body)
  } catch (err) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Invalid content, expected valid JSON' })
    }
  }

  const errors = []

  for (const field of ['gigId', 'name', 'email', 'nameOnCard', 'cardNumber', 'cardExpiryMonth', 'cardExpiryYear', 'cardCVC', 'disclaimerAccepted']) {
    if (!data[field]) {
      errors.push(`Missing or invalid field "${field}"`)
    }
  }

  if (errors.length) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: `Invalid request: ${errors.join(', ')}` })
    }
  }

  return {
    statusCode: 202,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({})
  }
}
