import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { stripe } from "@/lib/stripe"
import { getUserSubscriptionPlan } from "@/lib/subscription"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  if (session) {
    // Fetch data from your DB
    const subscriptionPlan = await getUserSubscriptionPlan(session.user.id)

    let isCanceled = false

    if (subscriptionPlan.isPro && subscriptionPlan.stripeSubscriptionId) {
      const stripePlan = await stripe.subscriptions.retrieve(
        subscriptionPlan.stripeSubscriptionId
      )
      isCanceled = stripePlan.cancel_at_period_end
    }

    // Respond with the fetched data
    res.json({ subscriptionPlan, isCanceled })
  } else {
    res.status(403).send("You must be signed in to view the subscription plan.")
  }
}
