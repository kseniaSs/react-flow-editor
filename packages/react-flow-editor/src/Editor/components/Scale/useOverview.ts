import { useEffect } from "react"

import { useRectsContext } from "@/Editor/rects-context"
import { overviewActions } from "@/Editor/state"

export const useOverview = () => {
  const { editorContainerRef, isMounted } = useRectsContext()

  const makeOverview = () => {
    if (isMounted && editorContainerRef.current) overviewActions.overview(editorContainerRef)
  }

  useEffect(makeOverview, [isMounted])

  return makeOverview
}
