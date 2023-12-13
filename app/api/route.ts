import OpenAI from "openai";
import prisma from "../../prisma/db";
const AWS = require("aws-sdk");
import fetch from "node-fetch";
import { S3 } from "aws-sdk";
import { redirect } from "next/navigation";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configure AWS SDK
const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION, // e.g., 'us-west-2'
});

async function uploadToS3(
  bucketName: string,
  key: string,
  contentType: string,
  buffer: Buffer
): Promise<void> {
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  };

  await s3.upload(params).promise();
  console.log(`Image uploaded successfully: ${bucketName}/${key}`);
}

async function downloadImageAndUploadToS3(
  imageUrl: string,
  bucketName: string,
  objectKey: string
): Promise<void> {
  const response = await fetch(imageUrl);
  if (!response.ok)
    throw new Error(`Failed to fetch image: ${response.statusText}`);

  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType =
    response.headers.get("content-type") || "application/octet-stream";

  await uploadToS3(bucketName, objectKey, contentType, buffer);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const id = searchParams.get("id");

  console.log(id);

  if (typeof id == "string") {
    console.log("Getting article with id: " + id);
    // Get article from database
    const article = await prisma.articles.findUnique({
      where: {
        id: id,
      },
    });

    // Return article
    return new Response(JSON.stringify(article), { status: 200 });
  } else {
    redirect("404");
  }
}

export async function POST(request: Request) {
  // Get the request body
  const body = await request.json();

  // GPT3.5 request to create: headline, author, body, and image prompt
  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          'You are a journalist, writing fake news articles that will be used to prank people. These articles will always be revealed as fake at the end of the article, as well as by the surrounding website. Given an example headline, you will produce a polished version of that headline, a description of an image that must fit the article (and does not violate the DALLE content policy), and the content for the article itself. The article should be short, 4 paragraphs maximum. The last paragraph should make it clear that this was AI generated, and not real, but try not to reveal that until the last paragraph. Return your response in JSON. \nThis must be valid JSON, so newlines must be represented by backslash n, in the format:\n{"headline": "HEADLINE", "image_prompt": "IMAGE_RPOMPT", "body": "BODY"}',
      },
      {
        role: "user",
        content: body.headline,
      },
    ],
    temperature: 1,
    max_tokens: 2000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  // Check for failure
  if (chatCompletion.choices[0].message.content) {
    // Extract headline, body, and image prompt from response
    const chatJson = JSON.parse(chatCompletion.choices[0].message.content);

    // Store article, image in database
    const article = await prisma.articles.create({
      data: {
        headline: chatJson.headline,
        body: chatJson.body,
      },
    });

    // Use image prompt from OpenAI to create image for article (TODO: allow selection from multiple images)
    const image = await openai.images.generate({
      model: "dall-e-3",
      prompt: body.headline,
      n: 1,
      size: "1024x1024",
    });
    const imageUrl = image.data[0].url;

    // Fetch image from URL
    if (imageUrl) {
      downloadImageAndUploadToS3(
        imageUrl,
        "fake-news-images",
        article.id + ".png"
      ).catch(console.error);
    } else {
      console.log("Image URL missing");
    }

    const updateStatus = await prisma.articles.update({
      where: { id: article.id },
      data: {
        image_url:
          "https://fake-news-images.s3.amazonaws.com/" + article.id + ".png",
      },
    });

    console.log(updateStatus);

    // Return article ID
    return new Response(JSON.stringify({ id: article.id }), { status: 200 });
  } else {
    // TODO: improve error logging
    return new Response("Error: " + { status: 500 });
  }
}
