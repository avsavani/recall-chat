import { DashboardConfig } from "types"

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Discord",
      href: "https://discord.gg/2j9JEjqj",
      icon: "discord",
    },
  ],
  sidebarNav: [
    {
      title: "Chat",
      href: "/dashboard",
      icon: "chat",
    },

    {
      title: "Your Data",
      href: "/dashboard/files",
      icon: "Database",
    },
  ],
}

// {
//   title: "Separator",
//   href: "/dashboard/separators",
//   isSeparator: true,
// },
// {
//   title: "Assistants",
//   items: [
//     {
//       title: "Research Assistant (coming soon)",
//       href: "/dashboard/agents",
//       icon: "Bot",
//       disabled: true,
//     },
//   ],
// },
