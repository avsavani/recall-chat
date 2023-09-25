import { supabaseAdmin } from "@/utils"
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export const config = {
    api: {
        bodyParser: true,
    },
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // Fetch the user's session
        const session = await getServerSession(req, res, authOptions)

        // Check if the session exists (i.e., the user is logged in)
        if (!session) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const { data, error } = await supabaseAdmin
            .from('frosty_docs')
            .select('doc_name, user_id, origin, URL')
            .eq('user_id', session.user.id);

        if (error) {
            console.error(error, "this is an error")
            return res.status(500).json({ error: "Error" });
        }

        // Filter the array to only unique 'doc_name' values
        const uniqueDocs = {};
        data.forEach(item => {
            uniqueDocs[item.doc_name] = {
                origin: item.origin,
                URL: item.URL
            };
        });

        // Convert the uniqueDocs object into an array of objects
        const uniqueDocsArray = Object.keys(uniqueDocs).map(key => {
            return {
                doc_name: key,
                origin: uniqueDocs[key].origin,
                URL: uniqueDocs[key].URL
            };
        });

        // Return the unique document names, origins, and URLs
        return res.status(200).json(uniqueDocsArray)
    } catch (error) {
        console.error(error, "this is another error")
        return res.status(500).json({ error: "Error" });
    }
}

export default handler;
