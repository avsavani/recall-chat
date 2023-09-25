import * as React from "react"
import MarkdownRenderer from "@/components/MarkdownRenderer"
import { IconOpenAI, IconUser, IconChevronUpDown } from '@/components/ui/icons'
import { AnimatePresence, motion } from "framer-motion"
import { PiCpuLight } from "react-icons/pi"

export function Answer({ content, error }) {
  return (
    <div className="h-auto ">
      <div className="pt-2 flex items-start">
        <div className="h-8 w-8 flex items-center justify-center rounded-md border shadow bg-primary text-primary-foreground">
          <PiCpuLight />
        </div>
        <div className="w-full md:min-w-[768px] ml-4">
          {error ? (
            <LoadingLine />
          ) : (
            <>
              <MarkdownRenderer content={content} />
              {!content && <LoadingLine />}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 2.5 } },
  exit: { opacity: 0, transition: { duration: 0.02 } },
}


function AnimatedQuestion({ submittedQ }) {
  return (
    <AnimatePresence>
      {submittedQ && (
        <div className="relative mb-4 flex items-center justify-centert ">
          <div className="h-8 w-8 p-2 flex items-center justify-center rounded-md border shadow bg-background">
            <IconUser />
          </div>
          <motion.h2
            key={submittedQ}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mx-auto text-sm  tracking-tighter ml-4"
          >
            {submittedQ}
          </motion.h2>

        </div>
      )}
    </AnimatePresence>
  )
}

export function DisplayUserQuestion({ submittedQ }) {
  return (
    <div style={{
      wordBreak: 'break-word',
      overflowWrap: 'break-word',
      maxWidth: '100%',
      maxHeight: '200px',  // Define a maximum height
      overflowY: 'auto',
    }}>


      <AnimatedQuestion submittedQ={submittedQ} />
    </div>
  )
}



function LoadingLine() {
  return (
    <div className="flex min-w-full animate-pulse px-4 py-5 sm:px-6">
      <div className="flex grow space-x-3">
        <div className="min-w-0 flex-1">
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-2 rounded bg-mauve-4"></div>
              <div className="col-span-1 h-2 rounded bg-mauve-4"></div>
            </div>
            <div className="h-2 rounded bg-mauve-4"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
