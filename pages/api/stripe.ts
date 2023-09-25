import { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { z } from "zod"
import { proPlan } from "@/config/subscriptions"
import { authOptions } from "@/lib/auth"
import { stripe } from "@/lib/stripe"
import { getUserSubscriptionPlan } from "@/lib/subscription"
import { absoluteUrl } from "@/lib/utils"

const billingUrl = absoluteUrl("/dashboard/billing")

async function handleGetStripe(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getServerSession(req, res, authOptions)
        if (!session?.user || !session?.user.email) {
            return res.status(403).end()
        }

        const subscriptionPlan = await getUserSubscriptionPlan(session.user.id)

        if (subscriptionPlan.isPro && subscriptionPlan.stripeCustomerId) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: subscriptionPlan.stripeCustomerId,
                return_url: billingUrl,
            })

            return res.json({ url: stripeSession.url })
        }

        const stripeSession = await stripe.checkout.sessions.create({
            success_url: billingUrl,
            cancel_url: billingUrl,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: session.user.email,
            line_items: [
                {
                    price: proPlan.stripePriceId,
                    quantity: 1,
                },
            ],
            metadata: {
                userId: session.user.id,
            },
        })

        return res.json({ url: stripeSession.url })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(422).json(error.issues)
        }
        console.error(error)
        return res.status(500).end()
    }
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        await handleGetStripe(req, res)
    } else {
        res.status(405).end() // Method Not Allowed
    }
}