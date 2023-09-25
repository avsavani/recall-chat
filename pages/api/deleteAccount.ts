import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    // extract userId from request body
    const { id: userId } = req.body;

    if (req.method === 'DELETE') {
        try {
            // Retrieve user
            const user = await db.user.findUnique({
                where: { id: String(userId) }
            });

            if (!user) throw new Error("User not found");

            if (user.stripeCustomerId) {
                // Cancel stripe subscription
                await stripe.customers.del(user.stripeCustomerId);
            }

            // delete user with Prisma
            const deletedUser = await db.user.delete({
                where: {
                    id: String(userId),
                },
            });

            return res.status(200).json({ message: 'User and their Stripe data deleted successfully' });

        } catch (error) {
            return res.status(500).json({ error: 'Failed to delete user or their Stripe data' });
        }
    }

    res.status(405).json({ error: 'Method not allowed' }); // handle any other HTTP methods
}