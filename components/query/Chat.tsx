import React, { useState, useEffect, useMemo, useRef } from "react"
import { LayoutGroup, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { SearchInput } from "@/components/SearchInput"
import { Answer, DisplayUserQuestion } from "@/components/perplexity/Answer"
import { useSupabaseQuery } from "@/hooks/use-query";
import { useChatHistory } from "@/hooks/useChatHistory";
import { Separator } from "../shadui/separator"
import { EmptyScreen } from "../emptyScreen"
import { useStore } from "@/lib/globalState";
import { useRouter } from 'next/router';
import { Button } from "../ui/button"
import { IconStop } from '@/components/ui/icons'
import mixpanel from '@/lib/initMixpanel';


const Chat = ({ user_id, chatThreadId, currentChatThread, handleCreateThread, fetchedMessages, setCurrentChatThread, chatClicked, setChatClicked,
  loadingStatus, setLoadingStatus }) => {

  const { insertChatHistory } = useChatHistory(chatThreadId, user_id);
  const {
    userQuestion,
    setUserQuestion,
    generateAnswer,
    answerStream,
    messages,
    resetMessageStates,
    stopAnswerGeneration,
  } = useSupabaseQuery(user_id, chatThreadId, setLoadingStatus);
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const layoutGroupWrapperRef = useRef<HTMLDivElement>(null);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [copyUserQuestion, setCopyUserQuestion] = useState(userQuestion);
  const { setChatHistory, setFetchedMessages, selectedThreadId, setSelectedThreadId } = useStore();
  const router = useRouter();


  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  function scrollToBottom() {
    layoutGroupWrapperRef.current?.scrollTo({
      top: layoutGroupWrapperRef.current.scrollHeight,
      behavior: "auto"
    });
  }

  const resetStates = () => {
    setChatClicked(true);
    setCurrentChatThread(null);
    setSelectedThreadId(null);
    setFetchedMessages([]);
    setChatHistory([]);
  };


  useEffect(() => {
    const handleRouteChange = (url) => {
      if (url === '/dashboard') {
        resetStates();
      }
    };
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);


  function handleChange(e) {
    setUserQuestion(e.target.value);
    setCopyUserQuestion(e.target.value);
  }

  useEffect(() => {
    if (chatClicked) {
      resetMessageStates();
      setChatClicked(false);
    }
  }, [chatClicked]);


  async function handleSubmit(e) {
    e.preventDefault();
    let currentQuestion = userQuestion.slice(0, 10000);
    setUserQuestion("");
    let threadId = chatThreadId;

    if (!currentChatThread || currentChatThread.length === 0) {
      const newThread = await handleCreateThread(currentQuestion);
      threadId = newThread.id;
      mixpanel.track("New Thread Created", { user_id: user_id, threadId: threadId });
      setCurrentChatThread(newThread);
      router.push(`/dashboard?threadId=${threadId}`)
    }
    const assistantAnswer = await generateAnswer();

    if (!assistantAnswer) {
      return;
    }

    const lastPair = [
      { role: "user", content: currentQuestion },
      { role: "assistant", content: assistantAnswer },
    ]
    await insertChatHistory(user_id, threadId, lastPair);

    setIsFirstMessage(false);
    setCopyUserQuestion("")
    mixpanel.track("User Sent Message", { user_id: user_id, threadId: threadId, message: currentQuestion });
  }

  const chatMessages = useMemo(() => {
    const newChatMessages = [
      ...fetchedMessages,
      ...messages,
    ];

    // If there's an answer stream, update the last message to include it as the answer
    if (answerStream && newChatMessages.length > 0) {
      const lastMessage = newChatMessages[newChatMessages.length - 1];
      if (lastMessage.type === "apiMessage") {
        lastMessage.message = answerStream;
      }
    }

    newChatMessages.sort((a, b) => {
      if (a.created_at && b.created_at) {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      return 0;
    });

    return newChatMessages;
  }, [messages, fetchedMessages, answerStream]);


  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);


  useEffect(() => {
    setIsFirstMessage(chatMessages.length === 0);
  }, [chatMessages]);


  return (
    <section className="mx-auto flex justify-center items-center md:pb-5 ">
      <div
        ref={layoutGroupWrapperRef}
        className="layout-group-wrapper w-full max-w-4xl"
      >
        <LayoutGroup >
          {isFirstMessage && (
            <motion.div
              className="order-first"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              transition={{
                opacity: { duration: 0.001 },
                layout: { duration: 0.001 },
              }}
            >
              <EmptyScreen setInputValue={setUserQuestion} />
            </motion.div >
          )}

          {chatMessages &&
            chatMessages.map((answer, i) => {
              return (
                <motion.div
                  layout
                  layoutId={`${answer.question}-container-${i}`}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    opacity: { duration: 0.001 },
                    layout: { duration: 0.001 },
                  }}
                  key={`${answer.id}-container-${i}`}
                >
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="pb-14 px-10"
                  >
                    <div>
                      <DisplayUserQuestion submittedQ={answer.question} />
                      <Separator orientation="horizontal" />
                      <Answer
                        error={loadingStatus === "error"}
                        content={answer.message}
                      />

                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
        </LayoutGroup>
      </div>

      <div
        className={cn(
          " md:w-auto mx-auto md:mx-0 lg:min-w-[850px] flex-grow",
          "fixed bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%"
        )}
      >
        <div className="flex h-10 items-center justify-center">
          {loadingStatus == 'loading' && (
            <Button
              variant="outline"
              onClick={() => stopAnswerGeneration(copyUserQuestion)}
              className="bg-background"
            >
              <IconStop className="mr-2" />
              Stop generating
            </Button>
          )}
        </div>

        <motion.div
          layout
          className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4"
        >
          <SearchInput
            loadingStatus={loadingStatus}
            textareaRef={textareaRef}
            value={userQuestion}
            handleClick={handleSubmit}
            handleChange={handleChange}
            isLoading={loadingStatus === "loading"}
            placeholder="Ask a follow-up question"
            disabled={loadingStatus == "loading"}
          />
          {/* <FooterText className="hidden sm:block" /> */}
        </motion.div>
      </div>

      <div ref={messagesEndRef} />
    </section>
  )
}


export default Chat;