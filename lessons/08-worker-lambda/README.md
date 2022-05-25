# 08 - Worker lambda

## Goals

In this section we will write a worker Lambda that is triggered by SQS (every time there is a new message avaialable) and we will use that to be able to send an email to confirm that a ticket has been purchased.

While doing that, we will learn:

  - How to configure SQS to trigger a lambda to process new messages in a queue
  - How to send an email from a Lambda (using mailtrap and ethereal)


## The worker Lambda definition

Let's start by definining our new `worker` lambda in our `template.yml`:


```yml
# ...
Resources:
  # ...
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
# ...
```

All this stuff should't feel too new at this point. But let's talk more about the `Events` section:

  - We have configured a Lambda event of type `SQS`
  - We specified the reference queue with the ARN of our queue

What's going to happen behind the scene is that SAM will provision a event source mapper configured to poll from the queue and invoke the lambda every time there is one or more messages available.

Finally, note that we defined our `Handler` property as `app.worker`, this means that we need to create a new function called `worker` in `app.ts` to define the code for this new lambda.


## The worker Lambda code

Ok, let's now write some code. As we said we need to add a `worker` function in `app.ts`.

We could follow this template to see how we could updade this file:


```ts
// app.ts

// ...

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

Doesn't look too bad!

The one thing that might surprise you though is that an SQS event can contain multiple records (messages), so we need to make sure we process all of them, that's why the bulk of the business logic is inside a `for` loop.


### Using mailtrap for simulating emails

If you really want to try and write some logic to send an email you can check out [`nodemailer`](https://nodemailer.com/), a very good library to send emails in Node.js!

NodeMailer integrates well with an ephemeral email service called [Ethereal](https://ethereal.email/), which is a service that can be used to test sending emails without havinbg to configure a real email service. The emails won't be sent for real, but just stored in a server and we can visualise a preview of every email through a URL.

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


## Closing off

That's the end of our tutorial! Well done for making it to the end! 🙀

If you need more insights or ideas to keep exploring the serverless world! Check out the next section: [Extras](/lessons/09-extras/README.md)!

---

| [⬅️ 07 - Send messages to SQS](/lessons/07-send-messages-to-sqs/README.md) | [🏠](/README.md)| [09 - Extras ➡️](/lessons/09-extras/README.md)|
|:--------------|:------:|------------------------------------------------:|
