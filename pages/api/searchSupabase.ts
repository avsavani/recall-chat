import { supabaseAdmin } from "@/utils"

export const config = {
  runtime: "edge",
}

const apiKey = process.env.OPENAI_API_KEY
const handler = async (req: Request): Promise<Response> => {
  try {
    const { query, matches, user_id } = (await req.json()) as {
      query: string
      matches: number
      user_id: string
    }

    const inputRaw = query.replace(/\n/g, " ")


    const res = await fetch("https://api.openai.com/v1/embeddings", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      method: "POST",
      body: JSON.stringify({
        model: "text-embedding-ada-002",
        input: inputRaw,
      }),
    })
    const json = await res.json()
    const embedding = json.data[0].embedding

    const { data: chunks, error } = await supabaseAdmin.rpc(
      "match_documents",
      {
        query_embedding: embedding,
        match_count: matches,
        p_user_id: user_id,
      }
    )

    if (error) {
      console.error("Supabase error:", error)

      return new Response(JSON.stringify({ error: "Error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify(chunks), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export default handler
