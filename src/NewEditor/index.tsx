import React, { useEffect } from "react"
import { draggableNodeState, gridState, nodesState, selectedNodeState } from "./ducks/store"
import { Node as NodeType } from "../types"
import { Container as ConnectionContainer } from "./components/Connections/Container"
import { RecoilRoot, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { Grid } from "./components/Grid"

import { NodeContainer } from "./components/Nodes/NodesContainer"

type EditorProps = { nodes: NodeType[] }

const Canvas: React.FC = () => {
  const [draggableNodeId, setDraggableNode] = useRecoilState(draggableNodeState)
  const selectedNodeId = useRecoilValue(selectedNodeState)
  const setSize = useSetRecoilState(gridState)
  const setNodes = useSetRecoilState(nodesState)
  let elementRef: HTMLDivElement | undefined = undefined

  useEffect(() => {
    const resizeCanvas = () => {
      console.log("resize Canvas")
      if (elementRef) {
        const rect = elementRef.getClientRects()[0]
        setSize({ width: rect.width, height: rect.height })
      }
    }

    window.addEventListener("resize", resizeCanvas)

    return () => window.removeEventListener("resize", resizeCanvas)
  }, [])

  const onDragEnded = () => {
    setDraggableNode(undefined)
  }

  const onDrag = (e: React.MouseEvent<HTMLElement>) => {
    if (!draggableNodeId) return

    const newPos = { x: e.screenX - elementRef.offsetLeft, y: e.clientY }

    setNodes((stateNodes) =>
      stateNodes.map((element) => (element.id === draggableNodeId ? { ...element, position: newPos } : element))
    )
    console.log("44")
  }

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Delete" && selectedNodeId) {
      setNodes((stateNodes) => stateNodes.filter(({ id }) => selectedNodeId !== id))
    }
  }

  return (
    <div
      ref={(element) => {
        if (element) {
          elementRef = element
          const rect = element.getClientRects()[0]
          setSize({ width: rect.width, height: rect.height })
        }
      }}
      onMouseUp={onDragEnded}
      onMouseMove={onDrag}
      onKeyDown={onKeyDown}
      tabIndex={0}
      className="react-flow-editor"
    >
      <Grid />
      <NodeContainer />
      <ConnectionContainer />
    </div>
  )
}

export const Editor: React.FC<EditorProps> = React.memo(({ nodes }) => (
  <RecoilRoot initializeState={({ set }) => set(nodesState, nodes)}>
    <Canvas />
  </RecoilRoot>
))
