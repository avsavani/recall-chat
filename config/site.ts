import { NavItem } from "@/types"

interface SiteConfig {
  name: string
  description: string
  mainNav: NavItem[]
  links: {
    twitter: string
    github: string
  }
}

export const siteConfig: SiteConfig = {
  name: "Recall Chat",
  description: "Meeting BOT powered by LLMS",
  mainNav: [],
  links: {
    twitter: "https://twitter.com/ashishsavani",
    github: "https://github.com/avsavani",
  },
}
