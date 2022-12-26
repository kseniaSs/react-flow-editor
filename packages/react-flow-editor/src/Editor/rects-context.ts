import { createContext, useContext } from "react"

import { MountedContexts } from "./types"

export const RectsContext = createContext<MountedContexts>({} as MountedContexts)

export const useRectsContext = () => {
  const rectsRef = useContext(RectsContext)

  return {
    editorContainer: rectsRef.editorContainerRef.current,
    zoomContainer: rectsRef.zoomContainerRef.current
  }
}
