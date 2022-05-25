# 04 - SAM (Serverless Application Model)

## Goals

In this lesson we will learn how to develop, test and deploy Serverless applications by using the Serverless Application Model (SAM) specification. We will use these concepts to build the first iteration of our API that will be able to list all the available gigs and a specific gig, selected by ID.

In particular, in this module, we will learn:

  - What SAM is and what it can do for us
  - How to write a SAM template for our APIs
  - How to create Lambda APIs for listing gigs and showing the details of one gig (by ID)
  - How to package and deploy the API to AWS
  - How to update our frontend project to actually use our new API


## Introduction to SAM

Creating, testing and deploying Lambda Functions often requires you to be able to bind several moving parts together (e.g. Lambda code and configuration, API Gateway configuration, DynamoDB, S3, Policies, etc.), so trying to manage every part manually from the command line might result in being a slow, boring and error prone operation.

To overcome those issues, AWS created SAM, short for [Serverless Application Model](https://github.com/aws/serverless-application-model).

AWS SAM is a model used to define serverless applications on AWS and it is based on [AWS CloudFormation](https://aws.amazon.com/cloudformation/).

CloudFormation is the standard way to deploy applications and infrastructure to AWS using the principles of Infrastructure as Code.

SAM serves as a higher level abstraction over ClouFormation offering a better Developer Experience that is more optimized for serverless use cases.

SAM allows you to define your infrastructure using YAML templates. Those templates can defines a set of objects which we want to provision to an AWS account (Lambda functions, API Gateway, policies, etc.).

Behind the scenes, when we deploy using SAM, it will then convert the SAM template into a fully fledged CloudFormation template and trigger the deployment through CloudFormation.


## SAM template for our application

Before starting to explore SAM let's explore the content of the folder called `backend` which is where we are going to implement our APIs.

The 3 main files there are:

```plain
backend
├── app.ts
├── package.json
└── template.yml
```

  - `app.ts`: the file containing the code for our Lambda functions
  - `package.json`: containes all the metadata (e.g. dependencies) for our application
  - `template.yml`: a YAML file that describes the configuration of our serverless application following the SAM specification.

Our initial goal is to create two APIs, one to retrieve the full list of available gigs and one to select a single gig by ID.

The two APIs will have respectively the following endpoints:

```
GET /gigs
GET /gigs/{id}
```

Where `{id}` is an arbitrary path parameter identifying the unique ID of a gig (e.g. `u2-bratislava`).

The current version of our `template.yml` file already contains all we need here, so let's review it together section by section:

```yaml
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31
Description: Backend api for TimelessMusic project

# ...
```

This initial part contains some metadata (e.g. our project description and the version of SAM and the SAM template that we want to use).

```yaml
# ...
Globals:
  Function:
    Timeout: 3
    Runtime: nodejs16.x
# ...
```

The `Globals` section allows us to specify configuration that is applied to all the resources of a given type in our template. It's a simple way to remove duplication.

In this case we are basically saying that all the lambda functions in our project should not run for more than 3 seconds and that we want to use the `nodejs16.x` runtime.

```yaml
# ...

Resources:
  listGigs:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: ./
      Handler: app.listGigs
      Events:
        Endpoint:
          Type: Api
          Properties:
            Path: /gigs
            Method: get
    Metadata:
      BuildMethod: esbuild
      BuildProperties:
        Minify: true
        Target: "es2020"
        Sourcemap: true
        EntryPoints:
          - app.ts

  gig:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: ./
      Handler: app.gig
      Events:
        Endpoint:
          Type: Api
          Properties:
            Path: /gigs/{id}
            Method: get
    Metadata:
      BuildMethod: esbuild
      BuildProperties:
        Minify: true
        Target: "es2020"
        Sourcemap: true
        EntryPoints:
          - app.ts

# ...
```

The `Resources` section defines all the resources that are part of our application. Every resource needs to have a type. Here we are defining two Lambda functions (type `AWS::Serverless::Function`), one for every API endpoint.

For every Lambda function we have an `Events` section which defines what triggers the lambda execution. In this case we want to use these Lambda function to respond to HTTP requests.

Finally, for every Lambda function we have a `Metadata` section. We are specifying this because we want to write our Lambda code in TypeScript so we have to tell SAM how to _build_ our TypeScript code before deploying it.

> **Note**: we are using `esbuild` as a build method (an efficient TypeScript compiler written in Go). This feature is still experimental in SAM, so you'll see us using the special flag `--beta-features` to allow this capability.

```yaml
# ...

Outputs:
  endpoint:
    Description: The API Gateway endpoint for TimelessMusic
    Value: !Sub "https://${ServerlessRestApi}.execute-api.${AWS::Region}.amazonaws.com/Prod/"
    Export:
      Name: timelessmusic:api-endpoint
```

The final part of our template is `Outputs`. This section allows us to define _values_ that we want to be shown as part of the output of a deployment.

In this case we want to display the final API base URL.

The `ServerlessRestApi` part of the URL is something that will be generated by AWS once the API Gateway for this project is deployed. We can't predict that value in advance, that's why having this `Outputs` section can be convenient.

If you want to validate that our template is correctly formatted you can run the following command (in the `backend` folder):

```bash
sam validate
```


## Gigs API with mock data

Let's finally write some code and implement a mock version of our 2 API endpoints. This means that for now we won't be returning real data from DynamoDB, but just some fake data statically generated by our code.

One simple way to generate 12 mock entries for our list of gigs is through the following code:

```ts
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
```

We can use this as a data source for both our endpoints:

  - For `gigs` we can simply return a JSON represtation of `mockGigs`.
  - For `gigs/:id` we need to search in `mockGigs` for the gig with the given ID and return it (or return a 404 if it does not exists).

Now it's your turn to shine: check out the code in [`backend/app.ts`](/backend/app.ts) and do the necessary changes.

You will find a bunch of comments to guide you, but if at any point if you feel stuck you can consult a solution in [`lessons/04-sam/app.ts`](/lessons/04-sam/app.ts).


### Local testing

If you want to test your changes locally you have to build the project first with the following command (from the `backend` folder):

```bash
sam build --beta-features
```

Then you can start a local web server simulating API Gateway with the following command (in the `backend` folder):

```bash
sam local start-api
```

At this point you can just send requests to your local web server:

```bash
curl http://localhost:3000/gigs | jq .
```

This should list all the 12 mock gigs.

```bash
curl localhost:3000/gigs/band0-location0 | jq .
```

This one should list the first gig.

```bash
curl localhost:3000/gigs/blah | jq .
```

This one should give you back a 404 error.

TODO: test that all the above work as expected



## Packaging and deploying the API

Well done!

Now let's push all this good stuff to AWS.

The first time we want to deploy a SAM project we can do that by running the following command (from the `backend` folder):

```bash
sam deploy --guided
```

This will walk you through a bunch of choices, you can go with the defaults except for the following ones:

- Specify a project name (e.g. `timelessmusic`)
- Say `Y` (yes) to `listGigs may not have authorization defined, Is this okay?`
- Say `Y` (yes) to `gig may not have authorization defined, Is this okay?`

If everything went well, after a few minutes, you should see a successful message and the CloudFormation output showcasing the URL of our freshly deployed API Gateway.

We can use that to send a request to the deployed version of the `gigs` endpoint:

```bash
curl https://<restapiid>.execute-api.eu-west-1.amazonaws.com/Prod/gigs | jq .
```

> **Warning**: make sure to replace `<restapiid>` with your actual id.


### Sync code in real time

A recent addition to SAM is the ability to watch your code changes and push them in near-real time to your remote deployment.

The idea behind this feature is that it's not always possible to simulate everything locally (or to do that with a good degree of accuracy), so sometimes it's just better to ship changes to AWS and try things there. Basically we are encouraged to use AWS more and more as a development environment and not just as a production environment.

We won't necessarily need to use this feature to be able to complete the rest of this workshop, but if you want to give this a shot you can do that with the following command (from the `backend` folder):

```bash
sam sync --stack-name timelessmusic --beta-features --watch
```

Confirm the prompt with `Y` (yes).

Now, try to change some code and check what happens in the console.

Your changes should be deployed in a few seconds and you should be able to interrogate your remote APIs and test the changes.


## Updating the frontend app to use the new API

Now that we have a API running on AWS with a public URL, we are ready to update our frontend application to use this API.

In order to do that we need to create a file called `settings.json` (in any folder) with the following content:

```json
{
  "apiBaseUrl": "https://<restapiid>.execute-api.eu-west-1.amazonaws.com/Prod"
}
```

> **Warning**: make sure to replace `<restapiid>` with your actual API Gateway id. Also make sure not to have any trailing `/` at the end of the URL.

Now we have to copy this file into our frontend bucket so that it will be served as `/.well-knwon/settings.json`:

```bash
aws s3 cp settings.json "s3://$FRONTEND_BUCKET/.well-known/settings.json"
```

Now your frontend should use your newly created mock APIs.

> **Note**: in case you are curious, this works because our frontend is built to always try to download the `/.well-knwon/settings.json` file when the page is loaded. If the file is there it will use it as a configuration file and it will know what's the URL of the APIs to use for the backend. If the file does not exist the app will switch in mock mode! If you enjoy frontend and React, you can see how this is implemented in [`frontend/src/settings.tsx`](/frontend/src/settings.tsx).


## Verify

If you followed these instructions carefully, you should now be able to visit the URL of the application (from lesson 1) and see that the page is now displaying our **mock** data.

If you inspect the network traffic you will also see that now the frontend application makes direct call to our new API from API Gateway.

In the [next lesson](/lessons/05-api-with-dynamodb/README.md) we will evolve our API to use the data we loaded in the DynamoDB table.


---

| [⬅️ 03 - APIs with Lambda](/lessons/03-apis-lambda/README.md) | [🏠](/README.md)| [05 - API with DynamoDB ➡️](/lessons/05-api-with-dynamodb/README.md)|
|:--------------|:------:|------------------------------------------------:|
