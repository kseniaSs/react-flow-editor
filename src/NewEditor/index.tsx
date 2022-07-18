import React, { useEffect, useState } from "react"
import {
  draggableNodeState,
  dragItemState,
  newConnectionState,
  nodesState,
  selectedNodeState,
  zoomState
} from "./ducks/store"
import { Node as NodeType } from "../types"
import { Container as ConnectionContainer } from "./components/Connections/Container"
import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil"
import Background from "./components/Background"

import { NodeContainer } from "./components/Nodes/NodesContainer"
import { BUTTON_LEFT } from "./constants"
import { inNode } from "./helpers"
import Node from "./components/Nodes/Node"

type EditorProps = { nodes: NodeType[] }

const ZOOM_STEP = 1.1

const Canvas: React.FC<EditorProps> = ({ nodes }) => {
  const [draggableNodeId, setDraggableNode] = useRecoilState(draggableNodeState)
  const [currentDragItem, setDragItem] = useRecoilState(dragItemState)
  const [newConnection, setNewConnectionState] = useRecoilState(newConnectionState)
  const selectedNodeId = useRecoilValue(selectedNodeState)
  const [stateNodes, setNodes] = useRecoilState(nodesState)
  const elementRef: React.RefObject<HTMLDivElement> = React.createRef()

  const [transformation, setTransformation] = useRecoilState(zoomState)

  useEffect(() => {
    const existingIds = stateNodes.map(({ id }) => id)

    if (!existingIds.length) {
      setNodes(nodes)

      return
    }

    const newNodes = nodes.filter(({ id }) => !existingIds.includes(id))

    setNodes([...stateNodes, ...newNodes])
  }, [nodes])

  const onDragEnded = () => {
    if (currentDragItem.type === "connection") {
      const outputNode = stateNodes.find((currentElement) => {
        return inNode(
          {
            x: newConnection.x + elementRef.current.offsetLeft,
            y: newConnection.y + elementRef.current.offsetTop
          },
          currentElement.rectPosition
        )
      })

      if (outputNode) {
        setNodes((nodesState) =>
          nodesState.map((el) =>
            el.id === selectedNodeId && !el.input.includes(outputNode.id)
              ? { ...el, input: [...el.input, outputNode.id] }
              : el
          )
        )
      }
    }
    setNewConnectionState(undefined)
    setDragItem((dragItem) => ({ ...dragItem, type: undefined }))
    setDraggableNode(undefined)
  }

  const onDrag = (e: React.MouseEvent<HTMLElement>) => {
    if (currentDragItem.type === "connection") {
      setNewConnectionState({
        x: e.clientX - elementRef.current.offsetLeft,
        y: e.clientY - elementRef.current.offsetTop
      })
    }

    if (currentDragItem.type === "viewPort") {
      const newPos = { x: e.clientX, y: e.clientY }
      const offset = { x: newPos.x - currentDragItem.x, y: newPos.y - currentDragItem.y }

      setTransformation({
        ...transformation,
        dx: transformation.dx + offset.x,
        dy: transformation.dy + offset.y
      })
    }

    if (currentDragItem.type === "node") {
      setNodes((stateNodes) =>
        stateNodes.map((el) => {
          const newPos = {
            x: el.position.x + (e.clientX - currentDragItem.x),
            y: el.position.y + (e.clientY - currentDragItem.y)
          }

          return el.id === draggableNodeId ? { ...el, position: newPos } : el
        })
      )
    }

    setDragItem((dragItem) => ({ ...dragItem, x: e.clientX, y: e.clientY }))
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
    if (e.button === BUTTON_LEFT && !currentDragItem.type) {
      setDragItem({ type: "viewPort", x: e.clientX, y: e.clientY })
    }
  }

  return (
    <div
      onMouseUp={onDragEnded}
      onMouseMove={currentDragItem.type ? onDrag : undefined}
      onWheel={onWheel}
      onKeyDown={onKeyDown}
      onMouseDown={onMouseDown}
      tabIndex={0}
      ref={elementRef}
      className="react-flow-editor"
    >
      <div
        className="zoom-container"
        style={{ transform: `translate(${transformation.dx}px, ${transformation.dy}px) scale(${transformation.zoom})` }}
      >
        <NodeContainer pointPosition={{ x: -10, y: -5 }} />
        <ConnectionContainer pointPosition={{ x: -10, y: -5 }} />
      </div>
      <Background />
    </div>
  )
}

export const Editor: React.FC<EditorProps> = React.memo(({ nodes }) => {
  return (
    <RecoilRoot>
      <Canvas nodes={nodes} />
    </RecoilRoot>
  )
})
