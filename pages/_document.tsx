import { Head, Html, Main, NextScript } from "next/document"
import Script from "next/script"
import { FancyBackground } from "@/components/Layouts"


export default function Document() {

  return (
    <Html lang="en">
      <Head />
      <body className="min-h-screen scroll-smooth font-sans text-zinc-900 antialiased dark:text-zinc-50">
        <Main />
        <NextScript />
      </body>
    </Html >
  )
}

{/* <Script src="https://apis.google.com/js/api.js" /> */ }