import { useState, useRef } from "react";
import { useUserInput } from "./useUserInput";
import { useMessageState } from "./useMessageState";
import { useChatHistory } from "./useChatHistory";
import mixpanel from '@/lib/initMixpanel';



let abortController = new AbortController();
export function useSupabaseQuery(user_id, chatThreadId, setLoadingStatus) {

  const { value: userQuestion, updateValue: setUserQuestion } = useUserInput("");
  const { getLastFiveChats } = useChatHistory(user_id, chatThreadId)
  const { messages, answerStream, setState: setMessageState, clearAnswerStream } = useMessageState({
    messages: [],
  });
  const { insertChatHistory } = useChatHistory(chatThreadId, user_id);
  const [previousContext, setPreviousContext] = useState('');

  const partialAnswerRef = useRef("");

  function resetMessageStates() {
    setMessageState((prevState) => ({
      ...prevState,
      messages: [],

    }));
  }

  async function generateAnswer() {


    const question = userQuestion.trim();
    if (!userQuestion) {
      alert("Please input a question");
      return;
    }

    setMessageState((state) => {
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            type: "apiMessage",
            question: question,

          },
        ],
      };
    });


    // Get last 5 messages from Supabase
    const previousFiveMessages = await getLastFiveChats(user_id, chatThreadId)


    // doc_names: ['bodyspec-results.pdf'],
    try {
      abortController = new AbortController();
      setLoadingStatus("loading");
      const searchResponse = await fetch("/api/searchSupabase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user_id,
          query: question,
          matches: 4,
        }),
        signal: abortController.signal,
      });

      const searchResult = await searchResponse.json()

      let context = '';

      for (let i = 0; i < Math.min(4, searchResult.length); i++) {
        context += `${i + 1}. Content: ${searchResult[i]["content"]} \n`;

      }

      if (context) {
        const contextLines = context.split('\n');
        const previousValues = contextLines.slice(0, 2).join('\n');
        setPreviousContext(previousValues);
      }

      const answerResponse = await fetch("/api/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question,
          context: context,
          conversationHistory: previousFiveMessages,
          previousContext: previousContext,
        }),
        signal: abortController.signal,
      });

      mixpanel.track("Assistant Sent Response", { user_id: user_id, threadId: chatThreadId });
      const data = answerResponse.body;

      if (!data) {
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;

      let accumulatedAnswerStream: string = "";


      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        accumulatedAnswerStream += chunkValue;
        partialAnswerRef.current = accumulatedAnswerStream;

        setMessageState((state) => ({
          ...state,
          answerStream: (state.answerStream ?? "") + chunkValue,
        }));

      }
      setMessageState((state) => {
        const messagesCopy = [...state.messages];
        const lastMessage = messagesCopy[messagesCopy.length - 1];
        lastMessage.message = accumulatedAnswerStream;
        return {
          ...state,
          messages: messagesCopy,
          answerStream: undefined,
          pendingSourceDocs: undefined,
        };
      });
      setLoadingStatus("complete");
      return accumulatedAnswerStream
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch request has been aborted');
      } else {
        setLoadingStatus("error");
        mixpanel.track("Error", {
          user_id: user_id,
          threadId: chatThreadId,
          error: error.toString()
        });
      }
    }
  }
  const stopAnswerGeneration = async (copyUserQuestion) => {

    abortController.abort();
    setLoadingStatus("idle");
    clearAnswerStream();
    const lastPair = [
      { role: "user", content: copyUserQuestion },
      { role: "assistant", content: partialAnswerRef.current },
    ];

    console.log("Last pair: ", lastPair)
    await insertChatHistory(user_id, chatThreadId, lastPair);
  };




  return {
    userQuestion,
    setUserQuestion,
    answerStream,
    history,
    messages,
    generateAnswer,
    resetMessageStates,
    setMessageState,
    stopAnswerGeneration,
    clearAnswerStream,
    abortController,
  };
}