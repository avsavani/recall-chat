import { json } from "stream/consumers"
import { OpenAIModel } from "@/types"

export async function modify_question(apiKey, question, historyMessagesText) {
  let modifiedQuestion = ""
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    method: "POST",
    body: JSON.stringify({
      model: OpenAIModel.GPT4,
      messages: [
        {
          role: "system",
          content: `As an AI assistant, your primary goal is to return a modified question based on the USER'S ORIGINAL QUESTION and their conversation history.
                                - If the question is a follow up question, Ensure that all inferred noun/pronoun/entities in the user's conversation history are explicitly mentioned in the modified question you returned.
                                - USE YOUR BEST JUDGEMENT TO INFER NOUN/PRONOUN/ENTITIES FROM Q OR A.
                                - In cases where the question is independent of the conversation history, improve the question for standalone understanding.
                                - If you cannot modify the user question based on conversation history or if it's too abstract, rewrite the question passed to you.
                                - In cases where the question refers to something mentioned in the user's conversation history, explicitly add those noun/pronoun/entities to the modified question.
                                - ONLY MODIFY THE QUESTION IF NECESSARY. Use your best judgment to decide whether to modify the original question or rewrite it as is.
                                - please use the exact words mentioned in the previous conversation history. Remember, DO NOT make up any words that are not semantically similar because it will
                                throw off the semantic search.
                                User's Conversation History to aid you in this task: ${historyMessagesText}
                                This conversation history consists of previous user's question and my systems answer. It has nothing to do with you. It is only for your reference to modify uer's original question.
                                REMEMBER, YOUR ONLY JOB IS TO MODIFY THE QUESTION OR REWRITE THE USER's ORIGINAL QUESTION. DO NOT ANSWER THE QUESTION AND DO NOT WRITE ANYTHING.
                                
                                For example if I ask how much is my rent and then I ask what are the consequences for not paying? it should be inferred that I am talking about not paying the rent`,
        },

        {
          role: "user",
          content: `User's Original question:${question}`,
        },
      ],

      max_tokens: 100,
      temperature: 0.5,
      stream: true,
    }),
  })
  const reader = res.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { value, done } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const contentRegex = /"content"\s?:\s?"(.*?)"/g

    let match
    while ((match = contentRegex.exec(chunk)) !== null) {
      modifiedQuestion += match[1]
    }
  }

  return modifiedQuestion
}
