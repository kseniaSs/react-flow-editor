import React from "react"
import { draggableNodeState, zoomState, newConnectionState, dragItem, nodesState, selectedNodeState } from "./ducks/store"
import { Node as NodeType } from "../types"
import { Container as ConnectionContainer } from "./components/Connections/Container"
import { RecoilRoot, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import Background from "./components/Background"

import { NodeContainer } from "./components/Nodes/NodesContainer"
import { inNode } from "./helpers"
import { BUTTON_LEFT } from "./constants"

type EditorProps = { nodes: NodeType[] }

const ZOOM_STEP = 1.1

const Canvas: React.FC = () => {
  const [draggableNodeId, setDraggableNode] = useRecoilState(draggableNodeState)
  const selectedNodeId = useRecoilValue(selectedNodeState)
  const [newConnection, setNewConnectionState] = useRecoilState(newConnectionState)
  const [currentDragItem, setDragItem] = useRecoilState(dragItem)
  const [stateNodes, setNodes] = useRecoilState(nodesState)

  let elementRef: HTMLDivElement | undefined = undefined

  const [transformation, setTransformation] = useRecoilState(zoomState)
  const [isViewPortMove, setViewPortMove] = useState(false)
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 })

  const onDragEnded = () => {
    console.log("on mouse DOWN", stateNodes)
    if (currentDragItem === "connection") {
      const outputNode = stateNodes.find((currentElement) => inNode(newConnection, currentElement.rectPosition))
    }
    setNewConnectionState(undefined)
    setDragItem(undefined)
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
      if (currentDragItem === "connection") {
        setNewConnectionState({ x: e.clientX, y: e.clientY })
      } else if (currentDragItem === "node") {
        setNodes(
          stateNodes.map((element) => (element.id === selectedNodeId ? { ...element, position: { x: e.clientX, y: e.clientY } } : element))
        )
      }
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
