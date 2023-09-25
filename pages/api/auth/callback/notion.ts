// /pages/api/auth/callback/notion.js
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req, res) {
  const code = req.query.code

  // Exchange the authorization code for an access token
  const clientId = process.env.OAUTH_CLIENT_ID
  const clientSecret = process.env.OAUTH_CLIENT_SECRET
  const redirectUri = process.env.OAUTH_REDIRECT_URI
  const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  const response = await fetch("https://api.notion.com/v1/oauth/token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Basic ${encoded}`,
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  })

  const tokenData = await response.json()

  // Save the tokenData (including access_token) in your preferred storage (e.g., session, cookie, or database)

  // Redirect the user to the desired page after successful authentication
  res.redirect("/dashboard")
}
