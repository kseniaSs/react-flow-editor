import { useLayoutEffect } from "react"

import { useRectsContext } from "@/Editor/rects-context"
import { overview } from "@/Editor/state/Overview"

export const useOverview = () => {
  const { editorContainer } = useRectsContext()

  const makeOverview = () => {
    if (editorContainer) overview(editorContainer)
  }

  useLayoutEffect(makeOverview, [Boolean(editorContainer)])

  return makeOverview
}
