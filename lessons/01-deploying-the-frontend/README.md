# 01 - Deploying the frontend

## Goals

In this lesson we will learn the basics of S3 and how to deploy a Single Page Application (our e-commerce frontend) using S3.

We will learn:

  - How to create an S3 bucket
  - How to copy files into the bucket
  - How to expose the content of the bucket as a public website
  - How to configure the bucket policies


## The frontend

We have already a frontend application developed as a Single Page Application (SPA).

The code is available in the [`frontend`](/frontend/) folder.

You can run a preview of the website on your machine by running:

```bash
npm run dev --workspace=frontend -- --open
```

Feel free to browse around to get a feeling for what the app looks like and it's supposed to do.

Don't worry if all the data looks _fake_. We are using mock data. We don't have a database and a set of APIs, just yet. We'll add those later!


### Building the frontend

The frontend application is written in React, so we need to build it before we can publish it.

To do that just run:

```bash
npm run build --workspace=frontend
```

If all goes well, all the files we need are now available in `frontend/dist`.


Let's now try to deploy this frontend to AWS!


## S3

We will deploy our frontend to S3.

S3 stands for **Simple Storage Service**. It's a storage service designed to host large amounts of data and a simple and reliable fashion.

Data is stored in the form of **objects** (effectively files) and it's organised into **buckets** (effectively like independent drives). Every object in a bucket is identified by a unique **key** (effectively like a path in a file system).

The following table recaps the main concepts to know about S3:

| **S3**     | **File System** analogy     |
|------------|-----------------------------|
| **Bucket** | Drive                       |
| **Object** | File on the drive           |
| **Key**    | Path of a file on the drive |


S3 can also expose the content of a bucket as a website.

Our goal is to copy all the static files from `frontend/dist` into an S3 bucket and then expose them using the S3 website feature.

At that point we should have a public URL that we (and everyone else really) can use to look at our website.


## Create a bucket

The first thing that we need to do is to create an S3 bucket into our AWS account.

An S3 bucket can be named by following the same conventions of DNS names, which means you can use lowercase letters, numbers, hyphens and dots (more details [here](http://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html)).

Also, like domain names, bucket names need to be unique (across all accounts), so we need to be careful and avoid collisions.

To create a bucket in your account you can run the following command:

```bash
export FRONTEND_BUCKET=timelessmusic-frontend-$(head /dev/urandom | env LC_CTYPE=C tr -cd 'a-z0-9' | head -c 6)
aws s3 mb s3://$FRONTEND_BUCKET
```

> **Note**: `mb` stands for _Make Bucket_

> **Note**: with the first command we create a random name for the bucket using a sequence of shell commands (to minimize the likelihood that somebody else has already reserved that name). Of course, if you prefer you can leave out the randomness and try to pick a unique name yourself like: `timelessmusic-frontend-for-unicorns`.

> **Note**: we also exported the generated bucket name in an environment variable called `FRONTEND_BUCKET`. So we can reference that in this terminal session in the future. For example, try running `echo $FRONTEND_BUCKET` in your terminal!

The script above will output something like this:

```plain
make_bucket: timelessmusic-frontend-abcdef
```

To verify that the bucket is there we can run:

```bash
aws s3 ls
```

This command will list all the buckets created in your account in your default region.


## Copy files to the bucket

TODO: ...

```bash
aws s3 cp frontend/dist "s3://$FRONTEND_BUCKET" --recursive
```


verify

```bash
aws s3 ls "s3://$FRONTEND_BUCKET" --recursive
```


> **Note**: another way to copy files into an S3 bucket is to use the [sync](http://docs.aws.amazon.com/cli/latest/reference/s3/sync.html) command.



## Expose the bucket as a website

TODO: ...

```bash
aws s3 website "s3://$FRONTEND_BUCKET/" --index-document index.html --error-document index.html
```

```bash
echo "http://$FRONTEND_BUCKET.s3-website-eu-west-1.amazonaws.com"
```


## Bucket policies

TODO: ...


```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": [
        "arn:aws:s3:::<FRONTEND_BUCKET>/*"
      ]
    }
  ]
}
```

> **Warning**: be sure to replace `<FRONTEND_BUCKET>` in the policy content with your actual bucket name (e.g. `"arn:aws:s3:::<FRONTEND_BUCKET>/*"` -> `"arn:aws:s3:::timelessmusic-frontend-abcdef/*"`).



```bash
aws s3api put-bucket-policy --bucket $FRONTEND_BUCKET --policy file://policy.json
```

## What about https

TODO:

explains that this is not supported but achievable with cloudfront.

Out of the scope for this workshop


## Verify

If you followed all the instruction correctly you should now have a functioning frontend with some stub data running in your bucket website.

Try to navigate all the different sections and make sure everything seems to work smoothly.

Also try to input a random url to see if the 404 page works as it should.


## Summary

TODO: ...


---

| [⬅️ 00 - README](/README.md) | [🏠](/README.md)| [02 - Setting up DynamoDB ➡️](/lessons/02-setting-up-dynamodb/README.md)|
|:--------------|:------:|------------------------------------------------:|
