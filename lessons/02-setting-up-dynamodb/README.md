# 02 - Setting up DynamoDB

## Goals

In this lesson we will learn some key concepts in DynamoDB, AWS own NoSQL cloud database.

In particular, in this unit, we will learn:

  - The basics of DynamoDB
  - How to create a DynamoDB table
  - How to load data into DynamoDB from a JSON file
  - How to read data from a DynamoDB table using the CLI


## DynamoDB basics

Amazon DynamoDB is a fully managed NoSQL database service that provides fast and predictable performance with seamless scalability. DynamoDB lets you offload the administrative burdens of operating and scaling a distributed database, so that you don't have to worry about hardware provisioning, setup and configuration, replication, software patching, or cluster scaling.

The following are the basic DynamoDB components:

- **Tables** – Similar to other database systems, DynamoDB stores data in tables. A table is a collection of data.
- **Items** – Each table contains multiple items. An item is effectively a collection of attributes that is somewhat uniquely identifiable among all of the other items (through a unique identifier or **primary key**). Items in DynamoDB are similar in many ways to rows, records, or tuples in other database systems. In DynamoDB, there is no limit to the number of items you can store in a table.
- **Attributes** – Each item is composed of one or more attributes. An attribute is a fundamental data element, something that does not need to be broken down any further.

When you create a table, in addition to the table name, you must specify the primary key of the table. The primary key uniquely identifies each item in the table, so that no two items can have the same key.

DynamoDB supports two different kinds of primary keys:

- **Partition key** – A simple primary key, composed of one attribute known as the partition key.
DynamoDB uses the partition key's value as input to an internal hash function. The output from the hash function determines the partition (physical storage internal to DynamoDB) in which the item will be stored.
In a table that has only a partition key, no two items can have the same partition key value.

- **Partition key and sort key** – Referred to as a composite primary key, this type of key is composed of two attributes. The first attribute is the partition key, and the second attribute is the sort key.
DynamoDB uses the partition key value as input to an internal hash function. The output from the hash function determines the partition in which the item will be stored. All items with the same partition key are stored together, in sorted order by sort key value.
In a table that has a partition key and a sort key, it's possible for two items to have the same partition key value. However, those two items must have different sort key values.

> **Note**: Modelling DynamoDB tables for different access patterns is not an easy feat. It requires a good degree of expertise. One of the best resources to learn more about DynamoDB is [The DynamoDB book by Alex DeBrie](https://www.dynamodbbook.com/).


## Creating a DynamoDB table

For our application, we need to store a number of gigs with a set of specific attributes.

Even if NoSQL databases are very flexible, it's always a good practice to have a well-defined data structure in mind.

The following table describes the attributes we want to use all over our application regarding gigs:

| Field name | Type | Description |
| ---------- | ---- | ----------- |
| `id` | string | Primary ID for a gig |
| `bandName` | string | The name of the performing band |
| `city` | string | The city where the original performance is held |
| `year` | string | The year (format `YYYY`) of the original performance |
| `date` | string | The date (format `YYYY-MM-DD`) when the time travel is happening |
| `venue` | string | The venue hosting the original performance |
| `collectionPointMap` | string | The filename of the picture thats shows the collection point on a map |
| `collectionPoint` | string | The address of the place where to go for the time travel |
| `collectionTime` | string | The time (format `HH:mm`) when the time travel happens |
| `originalDate` | string | The date (format `YYYY-MM-DD`) when the original performance happened |
| `capacity` | integer | The number of tickets available |
| `description` | string | The description of the band |
| `price` | string | The price (in USD) |

In reality, though, when you create a table in DynamoDB you only need to define the the **partition key** (and optionally the **sort key** if you need one).

DynamoDB is by design a schema-less database, which means that the data items in a table need not have the same attributes or even the same number of attributes.

In order to create the `gig` table (where we are going to store all the available gigs for our application), we can run the following command:

```bash
aws dynamodb create-table \
  --table-name gig \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

In this command the option `attribute-definitions` allows us to specify the name and the type of the attributes we will use as keys with the `key-schema` option. In this case we are defining the `id` field as *string* (type `S` in DynamoDB) to be a simple *partition key*. We don't need to use a sort key for our use case.

If the previous command was executed successfully you should see an output like the following:

```json
{
    "TableDescription": {
        "AttributeDefinitions": [
            {
                "AttributeName": "id",
                "AttributeType": "S"
            }
        ],
        "TableName": "gig",
        "KeySchema": [
            {
                "AttributeName": "id",
                "KeyType": "HASH"
            }
        ],
        "TableStatus": "CREATING",
        "CreationDateTime": "2022-05-23T15:14:01.509000+01:00",
        "ProvisionedThroughput": {
            "NumberOfDecreasesToday": 0,
            "ReadCapacityUnits": 0,
            "WriteCapacityUnits": 0
        },
        "TableSizeBytes": 0,
        "ItemCount": 0,
        "TableArn": "arn:aws:dynamodb:eu-west-1:1234567890:table/gig",
        "TableId": "94455f3b-1234-5578-b316-03027a73b36e",
        "BillingModeSummary": {
            "BillingMode": "PAY_PER_REQUEST"
        }
    }
}
```

> **Note**: You can list all the DynamoDB tables available in your AWS account (and region) with the following command:
> ```bash
> aws dynamodb list-tables
> ```


## Loading data into DynamoDB

Now that we have our table created, let's put some data in it!

A file containing all the data we need for our `gig` table is already created and available in [`assets/load-gig.json`](/assets/load-gig.json).

In order to load this data into our DynamoDB table, we have to issue the following command:

```bash
aws dynamodb batch-write-item --request-items file://assets/load-gig.json
```

If the command was executed successfully you should see the following output:

```json
{
    "UnprocessedItems": {}
}
```

> **Note**: if you open the file [`assets/load-gig.json`](/assets/load-gig.json) you will notice that it does not just contain the raw data but it actually follows a specific structure that resembles a series of *insert* actions (`PutRequest`). If you want to convert a regular JSON array into this peculiar DynamoDB format, you can use the module [json-dynamo-putrequest](https://www.npmjs.com/package/json-dynamo-putrequest).


## Reading data from DynamoDB using the CLI

In order to read the data present in a DynamoDB table you can use the `scan` command, which in our case will look like the following:

```bash
aws dynamodb scan --table-name gig
```

This command will return all the entries in the DynamoDB table in JSON format, plus some metadata regarding the current status of the table (e.g. the total number or items currently inserted).


## Verify

If in the previous step you were able to see all the records (12 in totals), then you executed all the steps correctly.

A quick way to re-verify this would be to run the following command:

```bash
aws dynamodb scan --table-name gig |  jq .ScannedCount
```

If you get `12` as output, well, congratulations, you can now move forward to the next lesson! 🎉

> **Warning**: if you just want to retrive information about the table without having to scan the entire dataset (which is, of course, cheaper and more convenient for big data sets), you should use the command `describe-table`:
> ```bash
> aws dynamodb describe-table --table-name gig
> ```


---

| [⬅️ 01 - Deploying the frontend](/lessons/01-deploying-the-frontend/README.md) | [🏠](/README.md)| [03 - APIs with Lambda ➡️](/lessons/03-apis-lambda/README.md)|
|:--------------|:------:|------------------------------------------------:|
