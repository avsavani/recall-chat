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
  name: "Typefrost",
  description: "Unlocking your knowledge base",
  mainNav: [],
  links: {
    twitter: "https://twitter.com/gautamtata",
    github: "https://github.com/gautamtata",
  },
}
