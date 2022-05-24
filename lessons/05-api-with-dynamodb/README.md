# 05 - API with DynamoDB

## Goals

In this lesson we will learn how to use the Node.js AWS SDK inside a Lambda and, more specifically, how to query DynamoDB with it.

In particular we will learn about:

  - Understanding policies and roles in AWS
  - How to create a role to allow our lambdas to access the data in DynamoDB
  - How to fetch the data in DynamoDB using the AWS SDK
  - How to update our Lambda code to fetch data from DynamoDB



## Understanding Policies and Roles in AWS

As explored briefly at the beginning of this workshop, AWS security model is based on policies, which are JSON documents that describe permissions.

Permissions in the form of policies can be attached to a number of different things: *users*, *resources*, *groups*, *roles*. Through these abstractions, AWS gives you the flexibility to organize permission in the way that works best for you and your organization.

The topic is very broad and I encourage you to read the [official documentation](https://aws.amazon.com/documentation/iam/) about security and identity management to go in detail, but let me recap here some of the main principles we need to know to make progress with our project.

The main principle of security in AWS is that a user (or a compute resource) can't access any resource, unless there is a specific policy that explicitly grants them the privilege.

So the common mindset is:

> Everything is blacklisted, unless explicitly whitelisted

A **role** is defined by AWS as:

> A tool for giving temporary access to AWS resources in your AWS account.

Which basically means that it's a generic container for policies that can be used to transfer permissions to user or resources.

For example, you can create a role called `BusinessAnalyst` and attach to it a number of policies that grants access to some important resources that business analysts in your company need to use.

When dealing with compute resources (like EC2 instances or Lambda functions), by default they are not authorized to perform any action to any other resource, but they can be authorized to **assume** a role and inherit the permissions defined for that role.

When deploying with SAM, by default, every Lambda gets attached a new role that uses the policy [AWSLambdaBasicExecutionRole](http://docs.aws.amazon.com/lambda/latest/dg/intro-permission-model.html#lambda-intro-execution-role).

`AWSLambdaBasicExecutionRole` guarantees to the Lambda only the minimum set of privileges needed to write logs to Cloudwatch. If you try to access any other resource, your Lambda execution will simply fail with a permission error.

So, what if we want to guarantee our Lambda a specific privilege, for example reading from a DynamoDB table or writing to an S3 bucket?

As you might have guessed we will need to create a new role with the needed permissions and allow the Lambda to assume that role.

In the next section we will see how to do that with SAM.


## Creating a role to access our DynamoDB table

We want to update our API Lambda functions to read the data from our `gig` database table. So we need to create a role that allows the Lambda to perform basic read actions on our DynamoDB table.

In SAM we can define roles in the `Resources` section.

Let's see how a new role called `GigsApiRole` can be defined in our `template.yaml`:

TODO: change this section to use inline policies as per template

```yaml

# ...

Resources:

  # ...

  GigsApiRole:
    Type: "AWS::IAM::Role"
    Properties:
      ManagedPolicyArns:
        - "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
      AssumeRolePolicyDocument:
        Version: "2012-10-17"
        Statement:
          - Sid: "AllowLambdaServiceToAssumeRole"
            Effect: "Allow"
            Action:
              - "sts:AssumeRole"
            Principal:
              Service:
                - "lambda.amazonaws.com"
      Policies:
        - PolicyName: "GigsApiDynamoDBPolicy"
          PolicyDocument:
            Version: "2012-10-17"
            Statement:
              - Effect: "Allow"
                Action:
                  - "dynamodb:Scan"
                  - "dynamodb:GetItem"
                Resource: !Sub 'arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/gig'

  # ...
```

The first thing to notice is that a role resource has type `AWS::IAM::Role` and 3 main properties: `ManagedPolicyArns`, `AssumeRolePolicyDocument` and `Policies`.

  - `ManagedPolicyArns` allows the new role to inherit already existing policies in your AWS account. We use this capability to inherit the permissions from the `AWSLambdaBasicExecutionRole`. This way Lambda functions with this role will retain the capability to write logs to Cloudwatch.
  - `AssumeRolePolicyDocument` describes a specific policy that is needed to allow the Lambda to assume a role and inherit its permissions.
  - `Policies` is an array of policy directly created and attached to the role (inline policies). We use this option to create a policy that guarantees the capability to perform `Scan` and `GetItem` operation on our DynamoDB `gig` table. So at this stage we are basically guaranteeing read only access to the given DynamoDB table.

This change in our SAM template will make so that the next time we deploy the packaged template the role `GigsApiRole` will be created. But this is not enough to give permissions to our Lamba functions, because we still have to *attach* the new role to our functions.

To attach the `GigsApiRole` to our `listGigs` and `gig` functions we have to add **in both functions** a new property: `Role` which references to the new role:

```yaml
Role: !GetAtt GigsApiRole.Arn
```

If you want to be sure you updated the template file correctly, you can compare it with the one present in this repository in [`resources/lambda/gig-api-dynamodb/`](/resources/lambda/gig-api-dynamodb/template.yaml).

TODO: revisit link above...


At this point, if you did everything correctly, you should be able to validate and re-deploy your project (from the `backend` folder):

```bash
sam validate
sam deploy --guided
```

The code is not changed, so the API still returns mock data, but now the underlying Lambda functions have the permission to read from our DynamoDB table.

In the next section we will see how to take advantage of this new capability.


## Accessing DynamoDB with the AWS SDK

The first thing we need to do is to install the AWS SDK and, in particular, the package that allows us to interact with DynamoDB:

```bash
npm i --save @aws-sdk/client-dynamodb
```

### Listing all the tables

Now let's write a quick script that allows us to list all the DynamoDB tables available in our account:

```js
// backend/scripts/list-tables.js
import { DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb'

const client = new DynamoDBClient({})
const command = new ListTablesCommand({})
try {
  const result = await client.send(command)
  console.log('DynamoDB tables', result.TableNames)
} catch (err) {
  console.error(err)
}
```

Let's discuss this code, because it highlights some patterns that are quite common when using the AWS SDK.

  - First of all, every time we want to programmatically interact with an AWS service we need to **instantiate a client object** for that service. Here we get a DynamoDB client by importing `DynamoDBClient` and instantiating it. The client can be configured with options. In our case we are ok with the defaults, so we can just pass an empty object.
  - Secondly, in a very object oriented fashion, **a client can execute specific commands**, but every command needs to be importend and instantiated as well. Here we are importing `ListTablesCommand` and instantiating that as well.
  - Finally, **a cliend can execute commands using the `send()` method** (in our case: `client.send(command)`). A command returns a promise that can be used to monitor the progress of that command and its final result.

If we run this script we should see something like this:

```plain
DynamoDB tables [ 'gig', <... potentially more tables> ]
```


### Listing all the gigs

One way to list all the gigs is to **scan** the `gig` table.

> **Warning**: scanning a DynamoDB table is not the most efficient way to get data and it is not recommended for large datasets. This is ok in our case but it's something to be discouraged in production applications. There are several ways to design DynamoDB tables to avoid to use scan, but if you really need to use a scan you should at least paginate your results. For the sake of this tutorial we will keep things simple and just scan the entire table.

Let's write a script that scans the entire table then:

```js
// backend/scripts/list-gigs.js
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
```

As you might have expected this script is very similar to the previous one.

The only notable difference is that now we are using `ScanCommand` and it needs to be configured with the name of the table to scan `TableName` parameter.

A `ScanCommand` returns a `ScanCommandOutput` object. This object contains a bunch of metadata about the operation and a list of `Items`.

For our use case, we simply want to print the list of items.


### Using the DynamoDB doc client

If we look at the output of this script we might realise that the data is formatted in an inconvenient way. Let's look at an extract:

```json
{
    "capacity": { "N": "1950" },
    "collectionPoint": { "S": "1030 Highlands Plaza Dr St. Louis, MO 63110, USA" },
    "collectionTime": { "S": "14:00" },
    "originalDate": { "S": "1979-11-05" },
    "venue": { "S": "Checkerdome" },
    "bandName": { "S": "Fleetwood Mac" },
    "city": { "S": "St. Luis" },
    "date": { "S": "2019-04-30" },
    "image": { "S": "fleetwood-mac.jpg" }
}
```

You can see that the data is not flat but there are type annotations for every value (e.g. `N` stands for number type, `S` for string type).

In our case we don't really care about the types because we are already aware about the structure of the data, so ideally we would just like to flatten the returned object and get rid of all the type annotations.

The AWS SDK gives us an optinal library that can do exactly that.

Let's install it:

```bash
npm i --save @aws-sdk/lib-dynamodb
```

Now let's rewrite our script to take advantage of this helper library:

```js
// backend/scripts/list-gigs-flat.js
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
```

Let's discuss the changes from our previous version:

  - The first things to note is that we are now importing the `DynamoDBDocument` from our new library and also that we move the import of the `ScanCommand` from the same library too.
  - Then we instantiate a `docClient` by wrapping our existing `DynamoDBClient`: `const docClient = DynamoDBDocument.from(client)`
  - Finally we send the `command` using the new `docClient`.

At this point if we run this new command we should see a flat output:

```json
{
    "capacity": 1950,
    "collectionPoint": "1030 Highlands Plaza Dr St. Louis, MO 63110, USA",
    "collectionTime": "14:00",
    "originalDate": "1979-11-05",
    "venue": "Checkerdome",
    "bandName": "Fleetwood Mac",
    "city": "St. Luis",
    "date": "2019-04-30",
    "image": "fleetwood-mac.jpg"
}
```

Success! 🎉


### Getting a given gig by ID

Let's see now how we can get a given gig (by ID) using the SDK. Let's do that in a sample script called `get-gig.js`:

```js
// backend/scripts/get-gig.js
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
```

TODO: revisit the description below

This is a tiny bit more complicated. To do a DynamoDB query we need to use the `QueryCommand`. A query command needs to be configured with a `TableName` and a `KeyConditions`. The latter allows us to construct the _conditions_ of our query.

In this particular example we are getting the `gigId` as an argument from the CLI and we are configuring the query to match all the records that have exactly the `id` exactly matching `gigId` from the CLI.

Try to run the script above with two different inputs:

```bash
node scripts/get-gig.js fleetwood-mac-st-luis-1979
```

This one should print some data.

```bash
node scripts/get-gig.js invalid
```

While this one should print `undefined`.

> **Note**: If we have been able to execute all these scripts locally without permission issues because, when we run the scripts the SDK loads our user credentials and our AWS user has permission to list DynamoDB table, execute scan and query operations. When we execute the same code in a Lambda, we need to explicitly give these permissions to the Lambda. This is why we have crafted the policies above in our `template.yml`.


> **Note**: If you want to learn more about the SDK for DynamoDB, you can check out [the official documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/index.html).


## Using DynamoDB in our APIs

Now we should have acquired the needed knowledge to update our Lambda functions and make use of DynamoDB to fetch the data.

In order to update the `index.js` file you can use the following template:

TODO: update templates

```javascript
// 1. import AWS SDK
// 2. instantiate a document client

exports.listGigs = (event, context, callback) => {
  // 3. use the document client to perform a scan operation
  //    on the gig table
  //    
  //    - if the scan fail, log the error and return a 500 response
  //    - if the scan succeed return all the gigs in object with the key `gigs`
  //      and a 200 response
}

exports.gig = (event, context, callback) => {
  // 4. use the document client to get a single item from the gig
  //    table by slug
  //    
  //    - if the get fails, log the error and return a 500 response
  //    - if the scan succeed but without results return a 404 response
  //    - otherwise return the gig object with a 200 response
}
```

TODO: ...

Once you are done you can test things locally with:

```bash
sam build --beta-features
```

To build your project, and:

```bash
sam local start-api
```

To start the APIs locally

Then you could try the following requests:

```bash
curl localhost:3000/gigs | jq .
```

and

```bash
curl localhost:3000/gigs/the-beatles-new-york-1965 | jq .
```

If you also implemented a 404 response you shoul try:

```bash
curl localhost:3000/gigs/invalid | jq .
```


Now to deploy your new code:

```bash
sam build && sam deploy
```

> **Warning**: before deploying, make sure that you have added the new policy to your `template.yml` and that every lambda definition has a reference to the role (`Role: !GetAtt GigsApiRole.Arn`).


## Debugging your deployed lambdas

TODO: ...

listGigs function

```bash
sam logs --beta-features -n listGigs --stack-name timelessmusic --tail
```

or gig function

```bash
sam logs --beta-features -n listGigs --stack-name timelessmusic --tail
```


## Validate

If you followed all the steps correctly, you should now be able to refresh your frontend and see some real data!


## Summary

TODO: ...


---

| [⬅️ 04 - SAM](/lessons/04-sam/README.md) | [🏠](/README.md)| [06 - Purchase API ➡️](/lessons/06-purchase-api/README.md)|
|:--------------|:------:|------------------------------------------------:|
