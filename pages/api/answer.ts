import { OpenAIStream } from "@/utils"

export const config = {
  runtime: "edge",
}

type History = { role: string; content: string }[]

const apiKey = process.env.OPENAI_API_KEY

const handler = async (req: Request): Promise<Response> => {
  try {
    const { question, context, previousContext } =
      (await req.json()) as {
        question: string
        context: string
        previousContext: string
      }

    const stream = await OpenAIStream(
      question,
      apiKey,
      context,
      previousContext
    )

    return new Response(stream)
  } catch (error) {
    console.error("Error encountered:", error)
    return new Response("Error", { status: 500 })
  }
}

export default handler
