import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb'

const client = new DynamoDBClient({})
const command = new ScanCommand({
  TableName: 'gig'
})

try {
  const result = await client.send(command)
  console.log(result.Items)
} catch (err) {
  console.error(err)
}
