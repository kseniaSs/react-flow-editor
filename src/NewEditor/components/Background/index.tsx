import React, { memo, FC, useEffect, useState, useRef } from "react"
import cn from "classnames"
import { useRecoilValue } from "recoil"
import { zoomState } from "../../ducks/store"
import { BackgroundProps, BackgroundVariant } from "./types"

import { createGridLinesPath, createGridDotsPath } from "./utils"

const defaultColors = {
  [BackgroundVariant.Dots]: "#81818a",
  [BackgroundVariant.Lines]: "#eee"
}

const Background: FC<BackgroundProps> = ({
  variant = BackgroundVariant.Dots,
  gap = 15,
  size = 0.4,
  color,
  style,
  className
}) => {
  const ref = useRef<SVGSVGElement>(null)
  const [patternId, setPatternId] = useState<string | null>(null)
  const { dx, dy, zoom } = useRecoilValue(zoomState)

  useEffect(() => {
    // when there are multiple flows on a page we need to make sure that every background gets its own pattern.
    const bgs = document.querySelectorAll(".react-flow__background")
    const index = Array.from(bgs).findIndex((bg) => bg === ref.current)
    setPatternId(`pattern-${index}`)
  }, [])

  const scaledGap = gap * zoom || 1
  const xOffset = dx % scaledGap
  const yOffset = dy % scaledGap

  const isLines = variant === BackgroundVariant.Lines
  const bgColor = color ? color : defaultColors[variant]
  const path = isLines ? createGridLinesPath(scaledGap, size, bgColor) : createGridDotsPath(size * zoom, bgColor)

  return (
    <svg
      className={cn(["react-flow__background", "react-flow__container", className])}
      style={{
        ...style,
        width: "100%",
        height: "100%"
      }}
      ref={ref}
    >
      {patternId && (
        <>
          <pattern
            id={patternId}
            x={xOffset}
            y={yOffset}
            width={scaledGap}
            height={scaledGap}
            patternUnits="userSpaceOnUse"
          >
            {path}
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill={`url(#${patternId})`} />
        </>
      )}
    </svg>
  )
}

Background.displayName = "Background"

export default memo(Background)
