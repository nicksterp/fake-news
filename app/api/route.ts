import OpenAI from "openai"
import { PrismaClient } from "@prisma/client"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

const prisma = new PrismaClient()

export async function GET(request: Request) {
    const body = await request.json()

    // Get article from database
    const article = await prisma.articles.findUnique({
        where: {
            id: body.id
        }
    })

    // Return article
    return new Response(JSON.stringify(article), { status: 200 })
}

export async function POST(request: Request) {
    // Get the request body
    console.log(request.body)
    const body = await request.json()

    // GPT3.5 request to create: headline, author, body, and image prompt
    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                "role": "system",
                "content": "You are a journalist, writing fake news articles that will be used to prank people. These articles will always be revealed as fake at the end of the article, as well as by the surrounding website. Given an example headline, you will produce a polished version of that headline, a description of an image that might fight the article, and the content for the article itself. The article should be short, 4 paragraphs maximum. The last paragraph should make it clear that this was AI generated, and not real, but try not to reveal that until the last paragraph. Return your response in JSON, in the format:\n{\"headline\": \"HEADLINE\", \"image_prompt\": \"IMAGE_RPOMPT\", \"body\": \"BODY\"}"
            },
            {
                "role": "user",
                "content": body.headline
            }
        ],
        temperature: 1,
        max_tokens: 2000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
        })

    // Check for failure
    if (chatCompletion.choices[0].message.content) {
        // Extract headline, body, and image prompt from response
        const chatJson = JSON.parse(chatCompletion.choices[0].message.content)

        // Use image prompt from OpenAI to create image for article (TODO: allow selection from multiple images)
        
        // Store image in S3

        // Store article, image in database
        const article = await prisma.articles.create({
            data: {
                headline: chatJson.headline,
                body: chatJson.body,
                image_URL: "https://fake-news-images.s3.amazonaws.com/placeholder.png"
            }
        })

        // Return article ID
        return new Response(JSON.stringify({ id: article.id }), { status: 200 })

    } else { // TODO: improve error logging
        return new Response("Error: " + { status: 500 })
    }

}