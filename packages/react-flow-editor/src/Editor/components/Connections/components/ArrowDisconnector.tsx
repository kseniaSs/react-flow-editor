import React from "react"

import { Output, Point } from "@/types"
import { newConnectionActions } from "@/Editor/state"
import { useRectsContext } from "@/Editor/rects-context"

import { disconnectorStyle } from "../helpers"

type DisconnectorProps = {
  position: Point
  fromId: string
  output: Output
}

const ArrowDisconnector: React.FC<DisconnectorProps> = ({ position, fromId, output }) => {
  const { zoomContainer } = useRectsContext()

  const onMouseDown = (e: React.MouseEvent<SVGRectElement>) => {
    e.stopPropagation()
    const zoomRect = zoomContainer.getBoundingClientRect()

    newConnectionActions.dragArrowDisconnector(e, fromId, output, zoomRect)
  }

  return <rect onMouseDown={onMouseDown} className="disconnector" style={disconnectorStyle(position)} />
}

export default ArrowDisconnector
