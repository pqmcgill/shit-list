import { useCallback } from 'react'

export default function useClipboard() {
  return useCallback(
    (value) => {
      if (typeof value !== 'string') {
        throw new Error('useClipboard: value needs to be a string. instead got: ', value)
      } else {
        navigator.clipboard.writeText(value);
      }
    },
    []
  )
}
