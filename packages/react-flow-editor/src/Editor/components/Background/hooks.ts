import { useStore } from "@nanostores/react"
import { useContext } from "react"

import { TransformationMap } from "@/Editor/state"
import { RectsContext } from "@/Editor/context"

import { PatternDimensions } from "./types"
import { countOffset } from "./helpers"

export const usePatternDimensions = (gap: number): PatternDimensions => {
  const { editorContainerRef } = useContext(RectsContext)
  const editorRect = editorContainerRef.current?.getBoundingClientRect()

  const transformation = useStore(TransformationMap)

  return {
    scaledGap: gap * transformation.zoom || 1,
    xOffset: countOffset(transformation.dx, transformation.zoom, editorRect?.width),
    yOffset: countOffset(transformation.dy, transformation.zoom, editorRect?.height)
  }
}
