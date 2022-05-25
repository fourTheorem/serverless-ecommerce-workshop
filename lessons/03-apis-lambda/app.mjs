export async function hello (event) {
  return 'Hello World'
}

export async function hello2 (event) {
  // extract the query string parameter from the event (if not available, defaults to 'World')
  const name = event?.queryStringParameters?.name || 'World'

  // prepare the response body as a JSON string
  const body = JSON.stringify({
    message: `Hello ${name}`
  })

  // create the full response object
  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body
  }

  // return the response and complete the lambda execution
  return response
}
