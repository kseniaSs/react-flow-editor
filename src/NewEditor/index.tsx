import React, { useEffect } from "react"
import { gridState, newConnectionState, dragItem, nodesState, selectedNodeState } from "./ducks/store"
import { Node as NodeType } from "../types"
import { Container as ConnectionContainer } from "./components/Connections/Container"
import { RecoilRoot, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { Grid } from "./components/Grid"

import { NodeContainer } from "./components/Nodes/NodesContainer"
import { inNode } from "./helpers"

type EditorProps = { nodes: NodeType[] }

const Canvas: React.FC = () => {
  const setSize = useSetRecoilState(gridState)
  const setSelectedNode = useSetRecoilState(selectedNodeState)
  const selectedNodeId = useRecoilValue(selectedNodeState)
  const [newConnection, setNewConnectionState] = useRecoilState(newConnectionState)
  const [currentDragItem, setDragItem] = useRecoilState(dragItem)
  const [stateNodes, setNodes] = useRecoilState(nodesState)

  let elementRef: HTMLDivElement | undefined = undefined

  useEffect(() => {
    const resizeCanvas = () => {
      if (elementRef) {
        const rect = elementRef.getClientRects()[0]
        setSize({ width: rect.width, height: rect.height })
      }
    }

    window.addEventListener("resize", resizeCanvas)

    return () => window.removeEventListener("resize", resizeCanvas)
  }, [])

  const onDragEnded = () => {
    console.log("on mouse DOWN", stateNodes)
    if (currentDragItem === "connection") {
      const outputNode = stateNodes.find((currentElement) => inNode(newConnection, currentElement.rectPosition))
    }
    setSelectedNode(undefined)
    setNewConnectionState(undefined)
    setDragItem(undefined)
  }

  const onDrag = (e: React.MouseEvent<HTMLElement>) => {
    if (!selectedNodeId) return

    const newPos = { x: e.screenX - elementRef.offsetLeft, y: e.clientY }

    if (currentDragItem === "connection") {
      setNewConnectionState(newPos)
    } else if (currentDragItem === "node") {
      setNodes(
        stateNodes.map((element) => (element.id === selectedNodeId ? { ...element, position: newPos } : element))
      )
    }

    console.log("44")
  }

  console.log("rerender")
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
