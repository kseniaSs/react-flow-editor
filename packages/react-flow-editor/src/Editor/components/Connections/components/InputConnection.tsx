import { isEqual } from "lodash"
import React, { useContext } from "react"

import { Point } from "@/types"
import { DEFAULT_COLOR } from "@/Editor/constants"
import { EditorContext } from "@/Editor/context"

import { ARROW_ID } from "./Arrow"

type InputConnectionProps = {
  inputPosition: Point
  outputPosition: Point
}

const InputConnection: React.FC<InputConnectionProps> = ({ inputPosition, outputPosition }) => {
  const { connectorStyleConfig } = useContext(EditorContext)

  const dx = Math.max(Math.abs(inputPosition.x - outputPosition.x) / 1.5, 100)
  const a1 = { x: inputPosition.x - dx, y: inputPosition.y }
  const a2 = { x: outputPosition.x + dx, y: outputPosition.y }

  // https://javascript.info/bezier-curve
  const cmd = `M ${inputPosition.x} ${inputPosition.y} C ${a1.x} ${a1.y}, ${a2.x} ${a2.y}, ${outputPosition.x} ${outputPosition.y}`

  return (
    <path
      className="connection"
      d={cmd}
      markerStart={`url(#${ARROW_ID})`}
      fill="transparent"
      stroke={connectorStyleConfig.color || DEFAULT_COLOR}
    />
  )
}

export default React.memo(InputConnection, isEqual)
