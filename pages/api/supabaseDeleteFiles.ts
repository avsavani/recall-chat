import { NextApiRequest, NextApiResponse } from "next"
import { supabaseAdmin } from "@/utils"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const session = await getServerSession(req, res, authOptions)

    if (!session) {
      return res.status(401).json({ error: "Not authenticated" })
    }

    if (req.method === "DELETE") {
      const { doc_names } = req.body

      if (!doc_names || !Array.isArray(doc_names) || !doc_names.length) {
        return res
          .status(400)
          .json({ error: "Please provide at least one doc_name" })
      }

      const response = await Promise.all(
        doc_names.map(async (doc_name) => {
          const { data, error } = await supabaseAdmin
            .from("frosty_docs")
            .delete()
            .eq("doc_name", doc_name)
            .eq("user_id", session.user.id)

          if (error) {
            return { error }
          }

          return { data, doc_name }
        })
      )

      const errors = response.filter((item) => item.error)
      if (errors.length) {
        return res
          .status(500)
          .json({ error: "Error deleting one or more files" })
      }

      return res.status(200).json({ message: "Files deleted successfully" })
    }
    // Non-DELETE Requests Handler
    else {
      return res
        .status(405)
        .json({ error: "Only DELETE method is allowed for this endpoint" })
    }
  } catch (error) {
    console.error(error, "this is another error")
    return res.status(500).json({ error: "Error" })
  }
}

export default handler
