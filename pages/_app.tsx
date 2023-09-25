import type { AppProps } from "next/app"
import { Open_Sans, DM_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { useState, useEffect } from "react"
import { SWRConfig } from "swr"
import { Toaster } from "@/components/shadui/toaster"
import { toast } from "@/components/shadui/use-toast"
import { SessionProvider } from 'next-auth/react'
import { MDXProvider } from '@mdx-js/react';
import { components } from '@/components/mdx-components';
import { Providers } from "@/components/providers"
import LoadingBar from 'react-top-loading-bar'
import { useStore } from "@/lib/globalState"
import "@/styles/globals.css"

const fontSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontDMSans = DM_Sans({
  weight: "400",
  subsets: ["latin"],
  preload: true,
  variable: "--font-open-sans",
})




export default function App({ Component, pageProps }: AppProps) {
  const { isPsychicLoading } = useStore();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isPsychicLoading) {
      // Start the loading bar at 30%
      setProgress(30);
    } else {
      // Complete the loading bar to 100%
      setProgress(100);
    }
  }, [isPsychicLoading]);
  return (
    <>
      <style jsx global>{`
        :root {
          --font-roboto: ${fontSans.style.fontFamily};
          --font-open-sans: ${fontDMSans.style.fontFamily};

        }
      `}</style>
      <SWRConfig
        value={{
          revalidateOnFocus: false,
          onError: (error, key) => {
            toast({ title: `API Error - ${key}`, description: error.message })
          },
        }}
      >
        <Providers attribute="class" defaultTheme="light" enableSystem>
          <SessionProvider
            session={pageProps.session}
          >
            <MDXProvider components={components}>
              <LoadingBar color='#f11946' progress={progress} onLoaderFinished={() => setProgress(0)} />
              <Component {...pageProps} />
            </MDXProvider>
          </SessionProvider>
          <Analytics />
          <Toaster />
        </Providers>
      </SWRConfig>
    </>
  )
}