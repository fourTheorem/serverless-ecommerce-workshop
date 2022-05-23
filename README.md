# Serverless e-commerce workshop

[![Test](https://github.com/fourTheorem/serverless-ecommerce-workshop/actions/workflows/test.yml/badge.svg)](https://github.com/fourTheorem/serverless-ecommerce-workshop/actions/workflows/test.yml)

A workshop to learn how to create a simple serverless e-commerce and deploying it on AWS

---

It turns out we have accidentally discovered time travel! 😱

There is only one rule though: **we cannot use time travel to bet or play the lottery**! 😖

So, how can we profit from this amazing discovery? 🤔

Well, I have an idea: since we are cloud engineers and entrepreneurs, why don't we build a startup that allows music fans to go back in time and attend some of the concerts that made the history of music?

Sounds cool, right?

In this workshop we will be building a serverless e-commerce to sell the tickets for our music-time-travel business! Are you ready to get rich? 🤑

> **Warning**
> We can't promise you'll get (economically) rich with serverless, but taking this workshop will certainly _enrich_ your skills. And who knows where that might lead you...


## Learnings

This workshop will explore the following topics

- How to host a Single Page Application (SPA) on S3
- How to write APIs with AWS Lambda and API Gateway
- How to use DynamoDB to store the data for your APIs
- How to process forms with AWS Lambda
- How to publish messages (pub/sub) through SNS
- How to store unit of works on SQS
- How to create background workers with AWS Lambda
- ... and a lot of other useful things, like:
  - Serverless Application Model (SAM) and Cloudfront
  - AWS Roles, Policies and the security model in general
  - The AWS Command Line interface
  - Some bash tricks
  - Some other cool details about AWS and Serverless


## Requirements

Before getting started, make sure you have the following requirements:

 - Your own [AWS account](https://aws.amazon.com/free)
 - An AWS user with Admin access and Programmatic Access
 - The [AWS Command Line Interface](https://aws.amazon.com/cli) installed and configured for your user
 - [Node.js](https://nodejs.org) (v16 or higher)
 - A [bash](https://www.gnu.org/software/bash) compatible shell
 - [Docker](https://www.docker.com/)
 - [SAM / SAM Local](https://aws.amazon.com/serverless/sam/)

To make sure you have everything configured correctly, you can run the following command in your terminal:

```bash
aws sts get-caller-identity
```

If all went well, you should see something like this:

```json
{
    "UserId": "XYZ",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:username"
}
```

Finally, make sure to **clone this repository** locally and run:

```bash
npm install
```

To install all the necessary dependencies.


## Getting started

We will start by deploying a static website (our ecommerce frontend) to AWS!

[➡️ Lesson 01 - Deploying the frontend](/lessons/01-deploying-the-frontend/README.md)


## Contributing

In the spirit of Open Source, everyone is very welcome to contribute to this project.
You can contribute just by submitting bugs or suggesting improvements by
[opening an issue on GitHub](https://github.com/fourTheorem/serverless-ecommerce-workshop/issues) or by [submitting a PR](https://github.com/fourTheorem/serverless-ecommerce-workshop/pulls).


## License

Licensed under [MIT License](LICENSE). © fourTheorem
