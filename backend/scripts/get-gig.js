import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument, GetCommand } from '@aws-sdk/lib-dynamodb'

const gigId = process.argv[2]

const client = new DynamoDBClient({})
const docClient = DynamoDBDocument.from(client)
const command = new GetCommand({
  TableName: 'gig',
  Key: { id: gigId }
})

try {
  const result = await docClient.send(command)
  console.log(result.Item)
} catch (err) {
  console.error(err)
}
