import React, { useEffect, useCallback } from "react"
import _ from "lodash"
import {
  draggableNodeState,
  dragItemState,
  newConnectionState,
  nodesState,
  selectedNodeState,
  zoomState,
  pointPositionState,
  offsetState,
  dotSizeState
} from "./ducks/store"
import { Node as NodeType } from "../types"
import { Container as ConnectionContainer } from "./components/Connections/Container"
import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil"
import Background from "./components/Background"

import { NodeContainer } from "./components/Nodes/NodesContainer"
import { BUTTON_LEFT } from "./constants"
import { inNode } from "./helpers"
import { Transformation, Point as PointType, Offset } from "./types"

type EditorProps = { nodes: NodeType[], pointPosition?: PointType }

const ZOOM_STEP = 1.1

type PublicApiState = {
  transformation: Transformation
  setTransformation: (payload: Transformation) => void
  stateNodes: NodeType[]
}

type PublicApiInnerState = {
  apiState: PublicApiState
  callback: (state: PublicApiState) => void
}

const usePublicEditorApi = () => {
  const state: PublicApiInnerState = { apiState: null, callback: null }

  return {
    update: (payload: PublicApiState) => {
      state.apiState = payload

      if (state.callback) state.callback(state.apiState)
    },
    subscribe: (callback: (state: PublicApiState) => void) => {
      state.callback = callback

      if (state.apiState) state.callback(state.apiState)
    }
  }
}

export const EditorPublicApi = usePublicEditorApi()

const Canvas: React.FC<EditorProps> = ({ nodes, pointPosition }) => {
  const [offset, setOffset] = useRecoilState(offsetState)
  const [draggableNodeId, setDraggableNode] = useRecoilState(draggableNodeState)
  const [currentDragItem, setDragItem] = useRecoilState(dragItemState)
  const [newConnection, setNewConnectionState] = useRecoilState(newConnectionState)
  const selectedNodeId = useRecoilValue(selectedNodeState)
  const [stateNodes, setNodes] = useRecoilState(nodesState)
  const [pointStatePosition, setPointStatePosition] = useRecoilState(pointPositionState)
  const [transformation, setTransformation] = useRecoilState(zoomState)
  const [dotSize, setDotSize] = useRecoilState(dotSizeState)

  EditorPublicApi.update({ transformation, setTransformation, stateNodes })

  useEffect(() => {
    if (!_.isEqual(nodes, stateNodes)) setNodes(nodes)
    if (!_.isEqual(pointPosition, pointStatePosition)) setPointStatePosition(pointPosition)
  }, [nodes])

  const onDragEnded = () => {
    if (currentDragItem.type === "connection") {
      const outputNode = stateNodes.find((currentElement) => {
        return inNode(
          {
            x: newConnection.x,
            y: newConnection.y
          },
          currentElement.rectPosition,
          currentElement.position
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
        x: e.clientX - transformation.dx - offset.offsetLeft,
        y: e.clientY - offset.offsetTop - transformation.dy
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

      setNodes((stateNodes) =>
        stateNodes.map((el) => {
          const rectPosition = document.getElementById(el.id).getClientRects()[0]

          return { ...el, rectPosition }
        })
      )
    }

    if (currentDragItem.type === "node") {
      setNodes((stateNodes) =>
        stateNodes.map((el) => {
          const rectPosition = document.getElementById(draggableNodeId).getClientRects()[0]

          const newPos = {
            x: el.position.x + (e.clientX - currentDragItem.x) / transformation.zoom,
            y: el.position.y + (e.clientY - currentDragItem.y) / transformation.zoom
          }

          return el.id === draggableNodeId ? { ...el, position: newPos, rectPosition } : el
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

    setNodes((stateNodes) =>
      stateNodes.map((el) => {
        const rectPosition = document.getElementById(el.id).getClientRects()[0]

        return { ...el, rectPosition }
      })
    )
  }

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.button === BUTTON_LEFT && !currentDragItem.type) {
      setDragItem({ type: "viewPort", x: e.clientX, y: e.clientY })
    }
  }

  const containerRef = useCallback((element) => {
    if (element !== null) {
      const rect = element.getBoundingClientRect()

      setOffset({
        offsetLeft: rect?.left || 0,
        offsetTop: rect?.top || 0
      })
    }
  }, [])

  useEffect(() => {
    if (!dotSize.height && !dotSize.width && stateNodes.length) {
      const rect = document.getElementById(`dot-${_.first(stateNodes).id}`)?.getBoundingClientRect()

      rect && setDotSize(rect)
    }
  }, [dotSize, stateNodes])

  return (
    <div
      onMouseUp={onDragEnded}
      onMouseMove={currentDragItem.type ? onDrag : undefined}
      onWheel={onWheel}
      onKeyDown={onKeyDown}
      onMouseDown={onMouseDown}
      tabIndex={0}
      ref={containerRef}
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

export const Editor: React.FC<EditorProps> = React.memo(({ nodes, pointPosition }) => {
  return (
    <RecoilRoot>
      <Canvas nodes={nodes} pointPosition={pointPosition} />
    </RecoilRoot>
  )
})
