import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn, formatLongUrl, pluralize } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useToggle } from "@/hooks/use-toggle"

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.02 } },
}


export function Sources({ sources }) {
  const [isOpen, toggleIsOpen] = useToggle()

  return (
    <div className="my-2 border-t border-neutral-400/30">
      <Collapsible
        open={isOpen}
        onOpenChange={toggleIsOpen}
        className="space-y-2"
      >
        <div className="flex justify-between">
          <Header sources={sources} />
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="mt-2 w-9 p-0">
              <Icons.list className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
        </div>
        <ContentList sources={sources} isOpen={isOpen} />
      </Collapsible>
    </div>
  )
}

function Header({ sources }) {
  const sourceCount = `${sources.length} ${pluralize("SOURCE", sources.length)}`

  return (
    <div className="flex items-center justify-between space-x-4 pr-4">
      <div className="flex gap-2">
        <Icons.link className="h-4 w-4 stroke-violet-500 dark:stroke-black-400" />
        <p className=" text-sm font-bold leading-tight tracking-wide text-violet-500 dark:text-black-400">
          {sourceCount}
        </p>
      </div>
    </div>
  )
}

// function PillList({ sources }) {
//   return (
//     <motion.ul
//       variants={animateList}
//       initial="hidden"
//       animate="visible"
//       className="flex flex-wrap gap-2 after:mb-2"
//     >
//       {sources.map((source, i) => (
//         <PillListItem
//           key={`${source.metadata?.type || 'unknown'}-${i}`}
//           order={i}
//           source={source}
//         />
//       ))}
//     </motion.ul>
//   )
// }


// // function PillListItem({ order, source }) {
// //   const maxPathLength = 15;
// //   const [isOpen, setIsOpen] = useState(false);

// //   const formattedSource =
// //     source.metadata.type === ""
// //       ? formatLongUrl(source.metadata.source, maxPathLength)
// //       : source.metadata.source;

// //   const handleOnClick = () => {
// //     if (source.metadata.type === "") {
// //       setIsOpen(!isOpen);
// //     }
// //   };

//   return (
//     <motion.li
//       variants={animateItem}
//       className=" group block max-w-lg cursor-pointer rounded-full "
//       onClick={handleOnClick}
//     >
//       <motion.div
//         className="group flex items-center gap-x-1 divide-x divide-neutral-500/70 rounded-full border border-neutral-700/50 bg-transparent p-1 transition duration-300  group-hover:border-violet-10 dark:border-neutral-400/50 md:gap-x-2 md:p-2"
//       >
//         <Pill order={order} source={formattedSource} />
//         {isOpen && (
//           <AnimatedParagraph content={source.pageContent} />
//         )}
//       </motion.div>
//     </motion.li>
//   );
// }

// function Pill({ order, source }) {
//   return (
//     <>
//       <div className="divide-zinc-200 border-zinc-200 bg-transparent pl-1.5 transition duration-300 md:pl-2 ">
//         <div className=" fontOpenSans text-xs font-bold uppercase leading-none tracking-widest text-neutral-600 transition duration-300 selection:bg-black-8 selection:text-white group-hover:text-black-9 dark:text-neutral-400 dark:group-hover:text-black-500 ">
//           {order + 1}
//         </div>
//       </div>
//       <div className="px-1 md:px-3">
//         <div className="flex items-center  divide-mauve-1 border-mauve-6 bg-transparent transition duration-300 ">
//           <div className="font-open-sans text-sm text-mauve-12 transition-all duration-300 selection:bg-black-8 selection:text-white group-hover:text-black-9 dark:group-hover:text-black-10 ">
//             {source}
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

function ContentList({ sources, isOpen }) {
  return (
    <CollapsibleContent className="pt-3">
      <ul className="my-2 flex flex-col gap-3">
        <AnimatePresence>
          {sources.map((source, i) => (
            <motion.li
              key={`document-${i}`}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-3xl"
            >
              <Content
                key={`document-${i}`}
                order={i}
                source={source}
                isOpen={isOpen}
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </CollapsibleContent>
  );
}

function Content({ order, source, isOpen }) {
  const maxPathLength = 25;
  const formattedSource =
    source.metadata.type === ""
      ? formatLongUrl(source.metadata.source, maxPathLength)
      : source.metadata.source;

  return (
    <>
      {isOpen && (
        <div className="group block max-w-lg">
          <div className="fontOpenSans text-xs font-bold uppercase leading-none tracking-widest text-mauve-11 py-2">
            {order + 1}: {formattedSource}
          </div>
          <AnimatedParagraph content={source.pageContent} />
        </div>
      )}
    </>
  );
}
function AnimatedParagraph({ content }) {
  const [isClamped, toggleIsClamped] = useToggle()
  return (
    <AnimatePresence>
      {content && (
        <motion.p
          key={content}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={fadeIn}
          onClick={toggleIsClamped}
          className={cn(
            "  max-w-2xl font-open-sans text-sm text-mauve-12 transition-all duration-300 selection:bg-black-8 selection:text-white group-hover:text-violet-9 dark:group-hover:text-violet-11 md:max-w-full  ",
            isClamped ? "" : "line-clamp-5"
          )}
        >
          {content}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

export function uniqueSourceDocs(sourceDocs) {
  const seen = new Set();
  const uniqueDocs = sourceDocs.filter((doc) => {
    const isUnique = !seen.has(doc.doc_name);
    seen.add(doc.doc_name);
    return isUnique;
  });

  return uniqueDocs.map((doc) => {
    const truncatedFileName = doc.doc_name;

    return {
      metadata: {
        type: 'document',
        source: truncatedFileName,
      },
    };
  });
}