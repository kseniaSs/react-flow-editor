import React, { useEffect } from "react"
import _ from "lodash"
import { gridState, nodesState, selectedNodeState } from "./ducks/store"
import { Node as NodeType } from "../types"
import { Container as ConnectionContainer } from "./components/Connections/Container"
import { RecoilRoot, useRecoilValue, useSetRecoilState } from "recoil"
import { Grid } from "./components/Grid"

import { NodeContainer } from "./components/Nodes/NodesContainer"

type EditorProps = { nodes: NodeType[] }

const Canvas: React.FC<EditorProps> = ({ nodes }) => {
  const setSize = useSetRecoilState(gridState)
  const setSelectedNode = useSetRecoilState(selectedNodeState)
  const selectedNodeId = useRecoilValue(selectedNodeState)
  const setNodes = useSetRecoilState(nodesState)
  const stateNodes = useRecoilValue(nodesState)
  let elementRef: HTMLDivElement | undefined = undefined

  useEffect(() => {
    console.log("set nodes")
    setNodes(nodes)
  }, [nodes])

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
    setSelectedNode(undefined)
  }

  const onDrag = (e: React.MouseEvent<HTMLElement>) => {
    if (!selectedNodeId) return

    const newPos = { x: e.screenX - elementRef.offsetLeft, y: e.clientY }

    setNodes(stateNodes.map((element) => (element.id === selectedNodeId ? { ...element, position: newPos } : element)))
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

export const Editor: React.FC<EditorProps> = React.memo(
  ({ nodes }) => (
    <RecoilRoot>
      <Canvas nodes={nodes} />
    </RecoilRoot>
  ),
  _.isEqual
)
