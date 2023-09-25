import { SetStateAction } from "react"
import { User } from "@prisma/client"
import { Icons } from "@/components/icons"

export interface FileLite {
  expanded?: boolean
  name: string
  url?: string
  type?: string
  score?: number
  size?: number
  embedding?: number[]
  chunks?: TextEmbedding[]
  extractedText?: string
}

export interface FileChunk extends TextEmbedding {
  filename: string
  score?: number
}

export interface TextEmbedding {
  text: string
  embedding: number[]
}

export enum OpenAIModel {
  GPT4 = "gpt-4",
  GPT316k = "gpt-3.5-turbo-16k",
}

export type DocsConfig = {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export type MainConfig = {
  mainNav: MainNavItem[]
}

export type NavItem = {
  title: string
  href: string
  disabled?: boolean
}

export type MainNavItem = SidebarNavItem

export type NavLink = {
  title: string
  href: string
  disabled?: boolean
  icon?: keyof typeof Icons
}

export type SidebarTitle = {
  title: string
}

export type SidebarNavItem = {
  title: string
  disabled?: boolean
  href?: string
  external?: boolean
  icon?: keyof typeof Icons
  isSeparator?: boolean
} & (
  | {
      href: string
      items?: NavLink[]
    }
  | {
      href?: never
      items?: NavLink[]
    }
  | {
      href?: string
      items?: never
    }
)

export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
}

export type MarketingConfig = {
  mainNav: MainNavItem[]
}

export type DashboardConfig = {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export type SubscriptionPlan = {
  name: string
  description: string
  stripePriceId: string
}

export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<User, "stripeCustomerId" | "stripeSubscriptionId"> & {
    stripeCurrentPeriodEnd: number
    isHobby: boolean
    isPro: boolean
  }

export type MyDocument = {
  doc_name: string
  content: string
}

export type Message = {
  type: "apiMessage" | "userMessage"
  message: string
  isStreaming?: boolean
  sourceDocs?: MyDocument[]
  question?: string
}

export type History = {
  role: string
  content: string
}

export type SearchProps = {
  value: string
  loadingStatus: string
  handleChange: (e) => void
  handleClick: (e) => void
  isLoading: boolean
  placeholder: string
  className?: string
  disabled?: boolean
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>
}

export type FileChatHook = {
  userQuestion: string
  setUserQuestion: React.Dispatch<React.SetStateAction<string>>
  status: string
  messages: Message[]
  setStatus: React.Dispatch<React.SetStateAction<string>>
  pendingSourceDocs?: MyDocument[]
  history: History[]
  answerStream?: string
  generateAnswer: (e: any) => Promise<string>
  resetMessageStates: () => void
  stopGeneration: () => void
}

export type ChatThreadType = {
  id: string
  display_name: string
  created_at?: string
  updated_at?: string
}

export type LoadingStatus = "idle" | "loading" | "complete" | "error" | "typing"

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>
