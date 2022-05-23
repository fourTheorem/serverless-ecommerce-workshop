# APIs with Lambda

### Goal

In this lesson we will learn some of the key concepts with Lambda Functions and API Gateway, two services that can allow you to build and deploy scalable REST APIs in a quick and efficient fashion.

We will learn:

  - The basic of AWS Lambda
  - How to write our first AWS Lambda using Node.js
  - The basic of API Gateway
  - How to handle errors
  - The Lambda-proxy integration


## AWS Lambda basics

AWS Lambda is the core of *serverless compute* in the AWS cloud. The Lambda service allows you to write code (in the form of *functions*) that will be automatically executed by the runtime when specific events happen in your environment.

These are some of the typical use cases of Lambda:

  - Respond to an HTTP request (through API Gateway)
  - Process new files uploaded in an S3 bucket
  - Process new items created (or changed) in a DynamoDB table
  - Execute some job at a scheduled time (through Cloudwatch schedules)

In this lesson we will focus on the first use case, but if you are curious about all the Lambda capabilities and benefits you can learn more on the [official documentation page](https://aws.amazon.com/documentation/lambda/).


## First Lambda function in Node.js

A valid Node.js Lambda function needs to have a predefined signature:

```js
async function myLambdaFunction (event, context) {
  // business logic here
}
```

The important details here are `event` and `context`.

A Lambda Function is generally triggered by external events such as an API call or a cron job. You can bind a Lambda to one or more events so that every time the event happens it will trigger the execution of the Lambda code.

The `event` parameter will be populated with an object that describes the type of the event and provides all the relevant details (for example, what API was called and with which parameters).

The `context` parameter will contain some details regarding the execution context (for example how long this function has been running), we generally don't need to worry much about it unless we want to enable some advanced behaviours. Most of the time, lambda functions written in Node.js don't even declare `context` in the list of arguments.

It's also important to realise that this function is `async`. This means that we can use the `await` keyword inside the function body to handle asyncronous operations. The body of the function can also use `return` and `throw` to stop the execution and return a successful result or an error.

A typical Hello World Lambda will look like this (file `index.js`):

```js
// index.js
export async function hello (event) {
  return 'Hello World'
}
```

We could run this lambda function locally by using SAM (Serverless Application Model), which we will discuss in more detail in the next section.

For now just bear with me and create a file called `template.yml` (in the same folder where you created your `index.js`) with the following content:

```yml
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    Runtime: nodejs16.x

Resources:
  hello:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: .
      Handler: index.hello
```

Now we can run the following command:

```bash
sam local invoke --no-event hello
```

And if all went well we should see the following output:

```plain
Invoking index.hello (nodejs16.x)
Skip pulling image and use local one: public.ecr.aws/sam/emulation-nodejs16.x:rapid-1.50.0-x86_64.

Mounting /serverless-ecommerce-workshop as /var/task:ro,delegated inside runtime container
START RequestId: 87eaf05c-9139-4a6f-b474-91cb23053915 Version: $LATEST
END RequestId: 87eaf05c-9139-4a6f-b474-91cb23053915
REPORT RequestId: 87eaf05c-9139-4a6f-b474-91cb23053915	Init Duration: 0.92 ms	Duration: 833.59 ms	Billed Duration: 834 ms	Memory Size: 128 MB	Max Memory Used: 128 MB
"Hello World"
```

Note that `"Hello World"` in the last line. This is the output of the lambda execution.

So this seems to work as expected!


## API Gateway basics

Amazon API Gateway is a fully managed service that makes it easy for developers to create, publish, maintain, monitor, and secure APIs at any scale.

This service allows you to create endpoints and map them to different integration points like another HTTP endpoint, another AWS service, a Lambda function or a mock endpoint.

For the sake of this tutorial, we will use Lambda function as API Gateway integration endpoint.

In this case, API Gateway offers a convention-based integration mode called [lambda-proxy integration](http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html#api-gateway-proxy-integration-lambda-function-nodejs).

This mode, basically provides a way to map a generic HTTP request to the JSON event that gets passed to the lambda function and expects from the lambda function a response that represents an HTTP response in a pre-defined format.


### Lambda-proxy integration input format

The event received in your Lambda as result of an API call will look like the following, as defined in  [Input Format of a Lambda Function for Proxy Integration](http://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format):

```
{
  "resource": "Resource path",
  "path": "Path parameter",
  "httpMethod": "Incoming request's method name"
  "headers": {Incoming request headers}
  "queryStringParameters": {query string parameters }
  "pathParameters":  {path parameters}
  "stageVariables": {Applicable stage variables}
  "requestContext": {Request context, including authorizer-returned key-value pairs}
  "body": "A JSON string of the request payload."
  "isBase64Encoded": "A boolean flag to indicate if the applicable request payload is Base64-encode"
}
```

Most of the time the attributes you will use from the `event` inside your lambda are:

  - `headers`: a dictionary object that allows you to read the list of headers sent in the HTTP request
  - `queryStringParameters`: a dictionary object that allows you to read the list of query string parameters sent in the HTTP request
  - `pathParameters`: in API gateway you can define arbitrary path parameters (we will see that shortly), if you do so, you will find the value for every parameter as a dictionary here.
  - `body`: the raw body sent for example in POST requests

Just to understand this better, let's make an example. Let's assume we have the following API specification to update or create a specific gig:

```
Endpoint: /gig/:slug ("slug" is a path parameter)
Method: POST
```

If we issue the following request:

```bash
curl \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{"band":"U2","location":"london"}' \
  https://abcdefgh.execute-api.eu-west-1.amazonaws.com/Prod/gig/u2-london?update=true
```

This data will be available in the Lambda event:

```json
{
  "headers": {
    "Content-Type": "application/json"
  },
  "method": "POST",
  "path": "/gig/u2-london",
  "pathParameters": {
    "slug": "u2-london"
  },
  "queryStringParameters": {
    "update": "true"
  },
  "body": "{\"band\":\"U2\",\"location\":\"london\"}"
}
```

So based on this abstraction you can get all the needed details from the current HTTP request
and provide a generate a response through your Lambda.


### Lambda-proxy integration output format

Similarly to what we just saw for the input format, there is also a convention for the [Output Format of a Lambda Function for Proxy Integration](http://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-output-format):

```
{
  "isBase64Encoded": true|false,
  "statusCode": httpStatusCode,
  "headers": { "headerName": "headerValue", ... },
  "body": "..."
}
```

This means that when we pass a response object to the `callback` function in our Lambda,
the object should have the following keys:

  - `statusCode`: the HTTP status code (e.g. 200, 404, ...)
  - `headers`: a dictionary of response headers (e.g. `{"Access-Control-Allow-Origin": "*"}` for CORS)
  - `body`: the raw body of the response (most of the time this is a JSON encoded string)


## A smarter Hello World Lambda ready for API gateway

To familiarize more with these input and output abstractions, let's re-build a simple Hello World lambda
suitable for API Gateway Lambda proxy integration that takes a `name` as query string parameter and returns a JSON body that contains `{"message": "Hello ${name}"}`.

```js
// index.js
export async function hello (event) {
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
```

Now, if we run our lambda without event again:

```bash
sam local invoke --no-event hello
```

We should see the following lambda output:

```json
{"statusCode":200,"headers":{"Content-Type":"application/json"},"body":"{\"message\":\"Hello World\"}"}
```

Let's create an event to simulate an HTTP request passing a queryString parameter. Let's call it `http-event-with-name.json`:

```json
{
  "queryStringParameters": {
    "name": "Alan Turing"
  }
}
```

We can now invoke our lambda locally and pass this new event with:

```bash
sam local invoke --event http-event-with-name.json hello
```

This time the lambda should produce the following JSON output:

```json
{"statusCode":200,"headers":{"Content-Type":"application/json"},"body":"{\"message\":\"Hello Alan Turing\"}"}
```

> **Note**: remember that with this approach we are not really testing our local code against a real HTTP request,
but just manually simulating what's happening at the Lambda layer. We will see later on how to use SAM to better test the API Gateway integration locally and how we could send curl requests directly to a lambda running locally.


## Handling Errors in Lambda-proxy integration

If you want to stop the execution of a Lambda with an error you have to invoke the callback by passing the error object as first parameter:

```js
export async function hello (event) {
  throw new Error('This execution failed')
}
```

If we run this lambda locally with `sam local invoke` we should see an output that looks like this:

```plain
START RequestId: 0bf9b3be-e861-4eaa-92e9-5abc93ba53b4 Version: $LATEST
2022-05-23T16:44:58.586Z	0bf9b3be-e861-4eaa-92e9-5abc93ba53b4	ERROR	Invoke Error 	{"errorType":"Error","errorMessage":"This execution failed","stack":["Error: This execution failed","    at Runtime.hello [as handler] (file:///var/task/index.js:2:9)","    at Runtime.handleOnce (file:///var/runtime/index.mjs:548:29)"]}
END RequestId: 0bf9b3be-e861-4eaa-92e9-5abc93ba53b4
REPORT RequestId: 0bf9b3be-e861-4eaa-92e9-5abc93ba53b4	Init Duration: 1.58 ms	Duration: 872.21 ms	Billed Duration: 873 ms	Memory Size: 128 MB	Max Memory Used: 128 MB
{"errorType":"Error","errorMessage":"This execution failed","trace":["Error: This execution failed","    at Runtime.hello [as handler] (file:///var/task/index.js:2:9)","    at Runtime.handleOnce (file:///var/runtime/index.mjs:548:29)"]}
```

The lambda execution simply fails as soon as the exception is thrown.


When running this Lambda in AWS, it will also terminate the execution with an error. The error will then be logged (in Cloudwatch) and the Lambda execution marked as failed.

In case the Lambda was triggered by an API Gateway request event, in such case, API Gateway doesn't have a response object and doesn't really know how to report the error to the client, so it simply defaults to a `502 Bad Gateway` HTTP error and you have no way to provide a detailed error report to the client.

The preferred way to report meaningful HTTP errors to client is to invoke the callback without error object and build a normal Lambda Proxy integration response objects (as saw previously) with the proper HTTP status code and all the error details in the body.

For example in case we want to respond with a 404 we can use the following code:

```js
export async function hello (event) {
  return {
    statusCode: 404,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ error: 'Content Not Found' })
  }
}
```

Or similarly if we want to return a specific HTTP 5xx error response:

```js
export async function hello (event) {
  return {
    statusCode: 599,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ error: 'Connection to external data source timed out' })
  }
}
```

In both cases, if we invoke the lambda locally, the execution won't fail. It will return a valid object that represents a specific HTTP error.

> **Note**: it's important to distinguish between generic programmatic errors (exceptions) and logic HTTP error responses here. In the first case we are effectively chrashing the lambda (which results in a 500 when using the API Gateway Integration). In the second case we are returning a perfectly valid HTTP response which indicates specific HTTP errors, but the lambda was executed to completion without issues.

When creating a production-ready™ Lambda for an API it's also a good practice to wrap the content of the Lambda in a `try` `catch` block in order to be able to manage unexpected errors and report them correctly as a 500 error to the invoking client:

```js
export async function hello (event) {
  try {
    // Business logic here...
  } catch (err) {
    // make sure the error is logged
    console.error(err)
    // return a proper 500 response to the client
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Internal Server Error' })
    }
  }
}
```

> **Warning**: When using this approach, your lambda executions are never marked as failed (in the web AWS Lambda dashboard) so, if you want reports regarding specific HTTP errors, you will have to extract those information from the logs or create CloudWatch alarms based on API Gateway metrics.


## Verify

This lesson was just a playground to get confident with AWS Lambda and API Gateway. We didn't add any new piece to our project.
In the next lesson we will use the concept learned here to start to implement the APIs that will power our application.


## Summary

TODO:


---

| [⬅️ 02 - Setting up DynamoDB](/lessons/02-setting-up-dynamodb/README.md) | [🏠](/README.md)| [04 - SAM ➡️](/lessons/04-sam/README.md)|
|:--------------|:------:|------------------------------------------------:|
