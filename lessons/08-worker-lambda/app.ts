import { randomUUID } from 'crypto'
import { APIGatewayProxyEvent, APIGatewayProxyResult, SQSEvent } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument, ScanCommand, GetCommand } from '@aws-sdk/lib-dynamodb'
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'
import nodemailer from 'nodemailer'

const client = new DynamoDBClient({})
const docClient = DynamoDBDocument.from(client)
const sqsClient = new SQSClient({})

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
        'content-type': 'application/json',
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
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: `Invalid request: ${errors.join(', ')}` })
    }
  }

  const ticketId = randomUUID()
  const purchaseData = {
    name: data.name,
    email: data.email,
    gigId: data.gigId,
    ticketId
  }

  const sendMessageCommand = new SendMessageCommand({
    MessageBody: JSON.stringify(purchaseData),
    QueueUrl: process.env.SQS_QUEUE_URL
  })

  await sqsClient.send(sendMessageCommand)

  return {
    statusCode: 202,
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ ticketId })
  }
}

type PurchaseRecord = {
  name: string,
  email: string,
  gigId: string,
  ticketId: string
}

export async function worker (event: SQSEvent) {
  const testAccount = await nodemailer.createTestAccount()
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass // generated ethereal password
    }
  })

  for (const record of event.Records) {
    const data = JSON.parse(record.body) as PurchaseRecord

    const emailMessage = `Hey ${data.name},
you are going back in time to enjoy one of the greatest concerts in the history of music! 🤘

This is the secret code that will give you access to our time travel collection point:

---
${data.ticketId}
---

Be sure to show it to our staff at entrance.

We already look forward (or maybe backward) to having you there, it's going to be epic!

— Your friendly Timeless Music staff

PS: remember that is forbidden to place bets or do any other action that might substantially
increase your net worth while time travelling. Travel safe!`

    const info = await transporter.sendMail({
      from: '"⏱ Timeless Music" <tickets@timelessmusic.com>',
      to: data.email,
      subject: '🎟 Your Timeless Music ticket',
      text: emailMessage
    })

    console.log(`Email sent to ${data.email} (${info.messageId}) - preview at: ${nodemailer.getTestMessageUrl(info)}`)
  }
}
