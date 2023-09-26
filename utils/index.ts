import { OpenAIModel } from "@/types"
import { createClient } from "@supabase/supabase-js"
import {
  ParsedEvent,
  ReconnectInterval,
  createParser,
} from "eventsource-parser"

const SUPABASE_SERVICE_ROLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

//  const userPlan = await getUserSubscriptionPlan(user_id)
// const modelName = userPlan.isPro ? 'gpt-4' : 'gpt-3.5-turbo-16k'

export const supabaseAdmin = createClient(
  NEXT_PUBLIC_SUPABASE_URL!,
  SUPABASE_SERVICE_ROLE_KEY!
)

export const OpenAIStream = async (
  question: string,
  apiKey: string,
  context: string,
  previousContext: string
) => {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  apiKey = process.env.OPENAI_API_KEY

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    method: "POST",
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are serving as the AI engine for Typefrost, an advanced system designed to facilitate users in navigating their own unique knowledge bases. 
          Users come to Typefrost to upload documents and connect integrations, forming a personalized knowledge base.

          As Typefrost's AI, your primary function is to provide relevant and helpful responses based on the user's queries. 
          The information you base your responses on is delivered as Contexts.

          Your responses are primarily informed by the following:

          Current Context: These are the snippets from the most relevant documents related to the current user's question.
          Previous Context: These are the snippets from the most relevant documents associated with the previous question.
          Chat History: The last 10 messages that form the conversation history.
          Your objective is to prioritize information in the following order:

          Current Context
          Previous Context
          Chat History
          Base GPT-4 assistant
          When no suitable match is found in the context, you will function as a standard OpenAI assistant, providing general information and help.
          Please do not explicitly mention "Current Context" or "Previous Context." The end user does not need to know this.

          As you generate responses, remember:

          To answer in Markdown format.

          You will receive document snippets that contain the document name and Document URL. Use these as references in your response.
          Ensure that the document name and URL are relevant to the user's question and response before including them.
          Keep document names and URLs unique. For snippets derived from the same document, include the document name and URL only once.
          
          Incorporating Document Information:
          If no URL is provided, just use the Document Name as a source in your response. If both are given, use both. When doing so, use the document name as a hyperlink with the URL being the destination:
            From the document [Document Name](Document URL), ...
          At the end of your response, include a 'Sources' section where you list all source documents used in preparing the answer. Format each source like this:
          Sources

          [Document Name](Document URL)
          Remember if no URL or Document Name is provided to you from any context or conversation history, do not include a source.
          If you are using multiple sources, list them in order of relevance.
          Use Markdown features like bullet points, tables, and table headings to create well-structured, easily digestible responses.
          Your ultimate goal is to aid users in accessing and comprehending their information effectively, providing precise, detailed, and user-friendly responses to their queries.`,
        },
        {
          role: "assistant",
          content: `Current Context: ${context}`,
        },
        {
          role: "assistant",
          content: `Previous Context: ${previousContext}`,
        },

        {
          role: "user",
          content: question,
        },
      ],
      max_tokens: 700,
      temperature: 0.01,
      stream: true,
    }),
  })

  if (res.status !== 200) {
    throw new Error("OpenAI API returned an error")
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data

          if (data === "[DONE]") {
            controller.close()
            return
          }

          try {
            const json = JSON.parse(data)
            const text = json.choices[0].delta.content
            const queue = encoder.encode(text)
            controller.enqueue(queue)
          } catch (e) {
            controller.error(e)
          }
        }
      }

      const parser = createParser(onParse)

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk))
      }
    },
  })

  return stream
}
