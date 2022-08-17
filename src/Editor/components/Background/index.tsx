import React, { memo, FC, useContext } from "react"
import { CLASSES } from "../../constants"
import { EditorContext } from "../../context"
import { BackgroundProps, BackgroundVariant } from "./types"
import { createGridLinesPath, createGridDotsPath } from "./utils"

const PATTERN_ID = "backgroundPattern"
const defaultColors = {
  [BackgroundVariant.Dots]: "#81818a",
  [BackgroundVariant.Lines]: "#eee"
}

const Background: FC<BackgroundProps> = ({ variant = BackgroundVariant.Dots, gap = 15, size = 0.4, color }) => {
  const { transformation } = useContext(EditorContext)
  const { dx, dy, zoom } = transformation

  const scaledGap = gap * zoom || 1
  const xOffset = dx % scaledGap
  const yOffset = dy % scaledGap

  const bgColor = color || defaultColors[`${variant}`]
  const path =
    variant === BackgroundVariant.Lines
      ? createGridLinesPath(scaledGap, size, bgColor)
      : createGridDotsPath(size * zoom, bgColor)

  return (
    <svg className={CLASSES.BACKGROUND}>
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

export default memo(Background)
