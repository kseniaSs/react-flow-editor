import React, { useState } from "react"
import { draggableNodeState, nodesState, selectedNodeState, zoomState } from "./ducks/store"
import { Node as NodeType } from "../types"
import { Container as ConnectionContainer } from "./components/Connections/Container"
import { RecoilRoot, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import Background from "./components/Background"

import { NodeContainer } from "./components/Nodes/NodesContainer"
import { BUTTON_LEFT } from "./constants"

type EditorProps = { nodes: NodeType[] }

const ZOOM_STEP = 1.1

const Canvas: React.FC = () => {
  const [draggableNodeId, setDraggableNode] = useRecoilState(draggableNodeState)
  const selectedNodeId = useRecoilValue(selectedNodeState)
  const setNodes = useSetRecoilState(nodesState)

  const [transformation, setTransformation] = useRecoilState(zoomState)
  const [isViewPortMove, setViewPortMove] = useState(false)
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 })

  const onDragEnded = () => {
    setDraggableNode(undefined)
    setViewPortMove(false)
  }

  const onDrag = (e: React.MouseEvent<HTMLElement>) => {
    if (isViewPortMove && !draggableNodeId) {
      const newPos = { x: e.clientX, y: e.clientY }
      const offset = { x: newPos.x - lastPos.x, y: newPos.y - lastPos.y }

      setTransformation({
        ...transformation,
        dx: transformation.dx + offset.x,
        dy: transformation.dy + offset.y
      })
      setLastPos({ x: e.clientX, y: e.clientY })
    }

    if (!draggableNodeId) return

    setNodes((stateNodes) =>
      stateNodes.map((el) => {
        const newPos = {
          x: el.position.x + (e.clientX - lastPos.x),
          y: el.position.y + (e.clientY - lastPos.y)
        }

        return el.id === draggableNodeId ? { ...el, position: newPos } : el
      })
    )

    setLastPos({ x: e.clientX, y: e.clientY })
  }

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Delete" && selectedNodeId) {
      setNodes((stateNodes) => stateNodes.filter(({ id }) => selectedNodeId !== id))
    }
  }

  const onWheel: React.WheelEventHandler<HTMLDivElement> = (event) => {
    const zoomFactor = Math.pow(ZOOM_STEP, Math.sign(event.deltaY))
    const zoom = transformation.zoom * zoomFactor

    setTransformation({ ...transformation, zoom })
  }

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.button === BUTTON_LEFT) {
      setViewPortMove(true)
      setLastPos({ x: e.clientX, y: e.clientY })
    }
  }

  return (
    <div
      onMouseUp={onDragEnded}
      onMouseMove={onDrag}
      onWheel={onWheel}
      onKeyDown={onKeyDown}
      onMouseDown={onMouseDown}
      tabIndex={0}
      className="react-flow-editor"
    >
      <div
        className="zoom-container"
        style={{ transform: `translate(${transformation.dx}px, ${transformation.dy}px) scale(${transformation.zoom})` }}
      >
        <NodeContainer />
        <ConnectionContainer />
      </div>
      <Background />
    </div>
  )
}

export const Editor: React.FC<EditorProps> = React.memo(({ nodes }) => (
  <RecoilRoot initializeState={({ set }) => set(nodesState, nodes)}>
    <Canvas />
  </RecoilRoot>
))
