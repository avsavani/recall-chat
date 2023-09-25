import { SubscriptionPlan } from "types"

export const freePlan: SubscriptionPlan = {
  name: "Free",
  description:
    "The free plan is limited to GPT-3 with a lower 15 files per month.",
  stripePriceId: "",
}

export const proPlan: SubscriptionPlan = {
  name: "PRO",
  description: "The PRO plan has GPT-4 and 100 files per month.",
  stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID || "",
}
