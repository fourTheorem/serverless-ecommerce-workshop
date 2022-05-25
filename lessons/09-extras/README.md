# 09 - Extras


## YEAH! 🤘

If you are reading this page you probably completed the workshop... If so, well done!

In this page you have some ideas for improving the application and for further learning.

I hope you had fun along the way and that's just the beginning of your Serverless fun!


## Ideas for further improvements:

- Instead of using S3 websites, use [AWS CloudFront](https://aws.amazon.com/cloudfront/) to serve your frontend application on a CDN (globally distributed and with support for HTTPS).
- Instead of creating your frontend S3 bucket and the DynamoDB table from CLI, try to do that in your SAM template.
- Improve the `listGigs` API to support pagination
- Create a new DynamoDB table for tracking purchased tickets and store them (you can also store the delivery state for sending the ticket via email)
- Manage tickets availability and make so that a customer can't purchase tickets for sold-out events (this might require changes also in the frontend)
- If you want to get very fancy you can also create a system that locks a ticket for a given amount of time while the user is filling the form for the purchase.
- Integrate a real payment system like [Stripe](https://stripe.com/ie) or [Paypal](https://www.paypal.com/) in the purchase API and process the payments against them (of course in test mode 😇)
- Configure [AWS SES](https://aws.amazon.com/ses/) to send real emails
- Create a nicer template email. You could add information about the concert, the date and where to go. You could also create a QRCode containing the ticket id.
- There are many other architectures and AWS services that can allow you to have a queue of messages to process. You might want to have a look at [DynamoDB streams](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.Lambda.html) and [Kinesis](https://aws.amazon.com/kinesis/).


## Cleaning up

If you want to delete all the resources created during this workshop from your aws account, you can do so with:

```bash
sam delete --stack-name=timelessmusic
```

Then remember to delete the `gig` DynamoDB table and the S3 bucket containing our frontend. The easiest way to do this is through the AWS Web interface.


That's all!

Well done again for getting so far! 👏


## Do you need a partner for your cloud journey?

This is what we do at [fourTheorem](https://fourtheorem.com), we help companies to move to the cloud and get the best out of it.

If you are curious to learn about some of the projects we have built with our customers, you can check out some of our case studies.

TODO: add link to case study page

If you are looking for a partner to speed up your cloud journey or to improve your existing cloud deployments, give us a shout, we'd be happy to help!

TODO: add link to contact page
