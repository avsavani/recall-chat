import { ChatThreadType, History, LoadingStatus, Message } from "@/types"
import { create } from "zustand"

type State = {
  chatHistory: History[]
  setChatHistory: (history: History[]) => void
  chatThreads: ChatThreadType[]
  setChatThreads: (chatThreads: ChatThreadType[]) => void
  currentChatThread: ChatThreadType | null
  setCurrentChatThread: (chatThread: ChatThreadType | null) => void
  fetchedMessages: Message[]
  setFetchedMessages: (fetchedMessages: Message[]) => void
  selectedThreadId: string | null
  setSelectedThreadId: (selectedThreadId: string | null) => void
  chatClicked: boolean
  setChatClicked: (value: boolean) => void
  loadingStatus: LoadingStatus
  setLoadingStatus: (status: LoadingStatus) => void
  isPsychicLoading: boolean
  setIsPsychicLoading: (value: boolean) => void
  isPsychicDoneLoading: boolean
  setIsPsychicDoneLoading: (value: boolean) => void
}

export const useStore = create<State>((set) => ({
  chatHistory: [],
  setChatHistory: (history) => set({ chatHistory: history }),
  chatThreads: [],
  setChatThreads: (chatThreads) => set({ chatThreads }),
  currentChatThread: null,
  setCurrentChatThread: (currentChatThread) => set({ currentChatThread }),
  fetchedMessages: [],
  setFetchedMessages: (fetchedMessages) => set({ fetchedMessages }),
  selectedThreadId: null,
  setSelectedThreadId: (selectedThreadId) => set({ selectedThreadId }),
  chatClicked: false,
  setChatClicked: (value) => set({ chatClicked: value }),
  loadingStatus: "idle",
  setLoadingStatus: (status) => set({ loadingStatus: status }),
  isPsychicLoading: false,
  setIsPsychicLoading: (value) => set({ isPsychicLoading: value }),
  isPsychicDoneLoading: false,
  setIsPsychicDoneLoading: (value) => set({ isPsychicDoneLoading: value }),
}))
