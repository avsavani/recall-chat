import { motion, AnimatePresence } from "framer-motion";
import { Button } from '@/components/shadui/button'
import { IconArrowRight } from '@/components/ui/icons'

const exampleMessages = [

    {
        heading: 'Give me the summary of the meeting',
        message: `Give me the summary of the meeting.`
    },
    {
        heading: 'Specific questions about the meeting',
        message: `What did Ashish say about Recall?`
    }
]

export function EmptyScreen({ setInputValue }) {
    return (
        <motion.div className="mx-auto max-w-2xl px-4" exit={{ opacity: 0, transition: { duration: 0.5 } }} >
            <div className="rounded-lg border bg-background p-8">
                <h1 className="mb-2 text-lg font-semibold">
                    Welcome to Recall Chat. ChatGPT for your meetings
                </h1>
                <p className="leading-normal text-muted-foreground">
                    Get started interacting with your new AI meeting. Add your files or connecting to your favorite platforms using the 'Add New Data Source' option in the sidebar.
                </p>
                <div className="mt-4 flex flex-col items-start space-y-2">
                    <p className="text-sm text-muted-foreground mb-2">
                        Here are some examples to inspire you (please note, these are based on hypothetical data sources):
                    </p>
                    {exampleMessages.map((message, index) => (
                        <Button
                            key={index}
                            variant="link"
                            className="h-auto p-0"
                            onClick={() => setInputValue(message.message)}
                        >
                            <IconArrowRight className="mr-2 text-muted-foreground" />
                            {message.heading}
                        </Button>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}