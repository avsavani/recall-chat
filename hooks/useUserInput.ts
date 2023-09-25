import { useState } from "react"

export function useUserInput(initialValue: string = "") {
  const [value, setValue] = useState(initialValue)

  function updateValue(newValue: string) {
    setValue(newValue)
  }

  function clearValue() {
    setValue("")
  }

  return { value, updateValue, clearValue }
}
