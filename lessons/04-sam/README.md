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

SAM allows you to define templates using YAML. Those templates can defines a set of objects which we want to provision to an AWS account (Lambda functions, API Gateway, policies, etc.).

Behind the scenes, when we deploy using SAM, it will then convert the template into a fully fledged CloudFormation template and trigger the deployment through CloudFormation.


## SAM template for our application

Before starting to explore SAM let's create a new folder called `backend` and let's explore the expected file structure of the SAM project that we will create inside it:

```plain
.
`-- backend
    |-- src
    |   `-- index.js
    `-- template.yml
```

In our new `backend` folder we have 2 files:

  - `src/index.js`: the file containing the code for our Lambda functions
  - `template.yml`: a YAML file that describes the configuration of our serverless application following the SAM specification.

Our goal is to create two APIs, one to retrieve the full list of available gigs and one to select a single gig by ID.

The two APIs will have respectively the following endpoints:

```
GET /gigs
GET /gigs/{id}
```

Where `{id}` is an arbitrary path parameter identifying the unique ID of a gig (e.g. `u2-bratislava`).

Let's see the content of our `template.yml` file:

```yaml
# TODO: ...
```


TODO: ...

```bash
sam validate --template backend/template.yml
```


## Gigs API with mock data

TODO: ...





TODO: ...


```bash
sam build --beta-features
```

```bash
sam local start-api
```

```bash
curl http://localhost:3000/gigs | jq .
```

```bash
curl localhost:3000/gigs/band0-location0 | jq .
```

```bash
curl localhost:3000/gigs/blah | jq .
```


## Packaging and deploying the API

```bash
sam deploy --guided
```

- Specify a project name (e.g. `timelessmusic`)
- Say `Y` (yes) to `listGigs may not have authorization defined, Is this okay?`
- Say `Y` (yes) to `gig may not have authorization defined, Is this okay?`


```bash
curl https://<restapiid>.execute-api.eu-west-1.amazonaws.com/Prod/gigs | jq .
```


### Sync code in real time

Faster development -> deployment loop

```bash
sam sync --stack-name timelessmusic --beta-features --watch
```

confirm the prompt with `Y` (yes).

try to change some code

check the console

your changes should be deployed in a few seconds


## Updating the frontend app to use the new API

TODO: ...



