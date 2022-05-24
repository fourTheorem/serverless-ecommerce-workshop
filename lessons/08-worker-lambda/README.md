# 08 - Worker lambda

## Goals



We will learn:

  - How to configure SQS to trigger a lambda to process new messages in a queue
  - How to send an email from a Lambda (using mailtrap)

TODO: ...



```yaml
  worker:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: ./
      Handler: app.worker
      Events:
        SQSQueueEvent:
          Type: SQS
          Properties:
            Queue: !GetAtt ticketPurchasedQueue.Arn
    Metadata:
      BuildMethod: esbuild
      BuildProperties:
        Minify: true
        Target: "es2020"
        Sourcemap: true
        EntryPoints:
          - app.ts
```


```ts
type PurchaseRecord = {
  name: string,
  email: string,
  gigId: string,
  ticketId: string
}

export async function worker (event: SQSEvent) {
  for (const record of event.Records) {
    const data = JSON.parse(record.body) as PurchaseRecord

    // TODO ... send email here or simulate that with a console.log
  }
}
```


### Using mailtrap for simulating emails 

A great library to send emails in Node.js is [`nodemailer`](https://nodemailer.com/).

NodeMailer integrates well with an ephemeral email service called [Ethereal](https://ethereal.email/).

This allows us to test sending emails without havinbg to configure a real email service.

Check out the [example on Nodemailer documentation website](https://nodemailer.com/about/#example) to see how you could send and preview a test email.

Alternatively you check a solution in the [`app.ts`](./app.ts) file in this lesson.

> **Note**: in real applications you would setup a real email server using [AWS SES (Simple Email Service)](https://aws.amazon.com/ses/).


### Deploy

Once you are happy with your code you can deploy it with:

```bash
sam build --beta-features && sam deploy
```


## Verify

To make sure everything works correctly you could simply tail the logs of the new `worker` Lambda function:

```bash
sam logs --beta-features -n worker --stack-name timelessmusic --tail
```

Now go to your frontend and try to purchase a few tickets.

If you did everything correctly, you should see some logs for every ticket purchased.


## Summary

TODO: ...


## Closing off

That's the end of our tutorial! Well done for making it to the end! 🙀

If you need more insights or ideas to keep exploring the serverless world! Check out the next section: [Extras](/lessons/09-extras/README.md)!

---

| [⬅️ 07 - Send messages to SQS](/lessons/07-send-messages-to-sqs/README.md) | [🏠](/README.md)| [09 - Extras ➡️](/lessons/09-extras/README.md)|
|:--------------|:------:|------------------------------------------------:|
