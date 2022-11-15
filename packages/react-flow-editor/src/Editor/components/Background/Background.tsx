import { TransformationAtom } from "@/Editor/state"
import { useStore } from "@nanostores/react"
import React, { FC } from "react"
import { BackgroundProps, BackgroundVariant } from "./types"
import { createGridLinesPath, createGridDotsPath } from "./utils"

const PATTERN_ID = "backgroundPattern"
const defaultColors = {
  [BackgroundVariant.Dots]: "#81818a",
  [BackgroundVariant.Lines]: "#eee"
}

const Background: FC<BackgroundProps> = ({ variant = BackgroundVariant.Dots, gap = 15, size = 0.4, color }) => {
  const transformation = useStore(TransformationAtom)

  const scaledGap = gap * transformation.zoom || 1
  const xOffset = transformation.dx % scaledGap
  const yOffset = transformation.dy % scaledGap

  const bgColor = color || defaultColors[`${variant}`]
  const path =
    variant === BackgroundVariant.Lines
      ? createGridLinesPath(scaledGap, size, bgColor)
      : createGridDotsPath(size * transformation.zoom, bgColor)

  return (
    <svg className="react-flow__background">
      <pattern
        id={PATTERN_ID}
        x={xOffset}
        y={yOffset}
        width={scaledGap}
        height={scaledGap}
        patternUnits="userSpaceOnUse"
      >
        {path}
      </pattern>
      <rect x="0" y="0" width="100%" height="100%" fill={`url(#${PATTERN_ID})`} />
    </svg>
  )
}

export default Background
