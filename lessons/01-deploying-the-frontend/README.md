# 01 - Deploying the frontend

## Goal

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

This will output something like:

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


## Expose the bucket as a website

TODO: ...


## Bucket policies

TODO: ...


## Verify

TODO: ...


## Summary

TODO: ...


---

| [⬅️ 00 - README](/README.md) | [🏠](/README.md)| [02 - TODO ➡️](/)|
|:--------------|:------:|------------------------------------------------:|
