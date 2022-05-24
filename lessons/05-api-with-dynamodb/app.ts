/* eslint-disable */
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
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result.Items)
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 500,
      headers: {
        'content-type': 'application/json',
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
          'content-type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: `Gig "${id}" not found!` })
      }
    }

    return {
      statusCode: 200,
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result.Item)
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 500,
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Could not fetch data from database' })
    }
  }
}
