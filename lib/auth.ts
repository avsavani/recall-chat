import { sendEmail } from "./sendEmail"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import EmailProvider from "next-auth/providers/email"
import GoogleProvider from "next-auth/providers/google"
import { siteConfig } from "@/config/site"
import { db } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  // replace prismaAdapter db as any for now
  // @see https://github.com/prisma/prisma/issues/16117
  adapter: PrismaAdapter(db as any),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_LOGIN_CLIENT_ID,
      clientSecret: process.env.GOOGLE_LOGIN_CLIENT_SECRET,
    }),

    EmailProvider({
      from: process.env.NEXT_PUBLIC_SMTP_FROM,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const user = await db.user.findUnique({
          where: {
            email: identifier,
          },
          select: {
            emailVerified: true,
          },
        })

        const templateId = user?.emailVerified
          ? process.env.NEXT_PUBLIC_SEND_GRID_SIGN_ON
          : process.env.NEXT_PUBLIC_SEND_GRID_ACTIVATION
        if (!templateId) {
          throw new Error("Missing template id")
        }

        const msg = {
          to: identifier,
          from: provider.from as string,
          templateId: templateId,
          dynamicTemplateData: {
            action_url: url,
            product_name: siteConfig.name,
          },
        }

        try {
          await sendEmail(msg)
        } catch (error) {
          console.error(error)

          if (error.response) {
            console.error(error.response.body)
          }

          throw new Error("Failed to send verification request")
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
      }

      return session
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      })

      if (!dbUser) {
        if (user) {
          token.id = user?.id
        }
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      }
    },
  },
}
