import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument, ScanCommand } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({})
const docClient = DynamoDBDocument.from(client)
const command = new ScanCommand({
  TableName: 'gig'
})

try {
  const result = await docClient.send(command)
  console.log(result.Items)
} catch (err) {
  console.error(err)
}
