import React from "react"
import _ from "lodash"
import { Vector2d } from "../../../geometry"

type InputConnectionProps = {
  inputPosition: Vector2d
  outputPosition: Vector2d
}

const InputConnection: React.FC<InputConnectionProps> = ({ inputPosition, outputPosition }) => {
  const dx = Math.max(Math.abs(outputPosition.x - inputPosition.x) / 1.5, 100)
  const a1 = { x: outputPosition.x - dx, y: outputPosition.y }
  const a2 = { x: inputPosition.x + dx, y: inputPosition.y }

  // https://javascript.info/bezier-curve
  const cmd = `M ${outputPosition.x} ${outputPosition.y} C ${a1.x} ${a1.y}, ${a2.x} ${a2.y}, ${inputPosition.x} ${inputPosition.y}`

  // just line, will be when we add props connectionType
  // cmd = `M ${outputPosition.x} ${outputPosition.y} L ${inputPosition.x} ${inputPosition.y}`

  return <path className="connection" d={cmd} markerStart="url(#triangle)" />
}

export default React.memo(InputConnection, _.isEqual)
