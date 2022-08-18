import { isEqual } from "lodash"
import React, { useContext } from "react"
import { Point } from "../../../../types"
import { CLASSES, DEFAULT_COLOR } from "../../../constants"
import { EditorContext } from "../../../context"
import { ARROW_ID } from "./Arrow"

type InputConnectionProps = {
  inputPosition: Point
  outputPosition: Point
}

const InputConnection: React.FC<InputConnectionProps> = ({ inputPosition, outputPosition }) => {
  const { styleConfig } = useContext(EditorContext)

  const dx = Math.max(Math.abs(outputPosition.x - inputPosition.x) / 1.5, 100)
  const a1 = { x: outputPosition.x - dx, y: outputPosition.y }
  const a2 = { x: inputPosition.x + dx, y: inputPosition.y }

  // https://javascript.info/bezier-curve
  const cmd = `M ${outputPosition.x} ${outputPosition.y} C ${a1.x} ${a1.y}, ${a2.x} ${a2.y}, ${inputPosition.x} ${inputPosition.y}`

  // just line, will be when we add props connectionType
  // cmd = `M ${outputPosition.x} ${outputPosition.y} L ${inputPosition.x} ${inputPosition.y}`

  return (
    <path
      className={CLASSES.CONNECTION}
      d={cmd}
      markerStart={`url(#${ARROW_ID})`}
      fill="transparent"
      stroke={styleConfig?.connector?.color || DEFAULT_COLOR}
    />
  )
}

export default React.memo(InputConnection, isEqual)
