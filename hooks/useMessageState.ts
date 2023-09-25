import { useState } from "react"

export function useMessageState(initialState) {
  const [state, setState] = useState(initialState)
  // Other helper functions if needed
  function clearAnswerStream() {
    setState((state) => ({
      ...state,
      answerStream: undefined, // Clear the answer stream
    }))
  }
  return { ...state, setState, clearAnswerStream }
}
