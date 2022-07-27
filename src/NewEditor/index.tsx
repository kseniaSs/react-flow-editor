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
  dotSizeState,
  autoScrollState,
  hoveredNodeIdState,
  inputPositionState
} from "./ducks/store"
import { Node as NodeType } from "../types"
import { Container as ConnectionContainer } from "./components/Connections/Container"
import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil"
import Background from "./components/Background"
import { NodeContainer } from "./components/Nodes/NodesContainer"
import { BUTTON_LEFT } from "./constants"
import { Transformation, Point as PointType, AutoScrollDirection, Axis, ItemType } from "./types"

type EditorProps = {
  nodes: NodeType[]
  pointPosition?: PointType
  inputPosition?: PointType
  isSingleOutputConnection?: boolean
}

const ZOOM_STEP = 1.1
const DRAG_OFFSET_TRANSFORM = 80
const DRAG_AUTO_SCROLL_DIST = 30
const DRAG_AUTO_SCROLL_TIME = 10

type PublicApiState = {
  transformation: Transformation
  setTransformation: (payload: Transformation) => void
  stateNodes: NodeType[]
  recalculateRects: () => void
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

const Canvas: React.FC<EditorProps> = ({ nodes, pointPosition, inputPosition, isSingleOutputConnection }) => {
  const [offset, setOffset] = useRecoilState(offsetState)
  const [draggableNodeId, setDraggableNode] = useRecoilState(draggableNodeState)
  const [currentDragItem, setDragItem] = useRecoilState(dragItemState)
  const [newConnection, setNewConnectionState] = useRecoilState(newConnectionState)
  const selectedNodeId = useRecoilValue(selectedNodeState)
  const [stateNodes, setNodes] = useRecoilState(nodesState)
  const [pointStatePosition, setPointStatePosition] = useRecoilState(pointPositionState)
  const [inputStatePosition, setInputStatePosition] = useRecoilState(inputPositionState)
  const [transformation, setTransformation] = useRecoilState(zoomState)
  const [dotSize, setDotSize] = useRecoilState(dotSizeState)
  const [autoScroll, setAutoScroll] = useRecoilState(autoScrollState)
  const hoveredNodeId = useRecoilValue(hoveredNodeIdState)

  const recalculateRects = useCallback(() => {
    setNodes((stateNodes) =>
      stateNodes.map((el) => {
        const rectPosition = document.getElementById(el.id).getClientRects()[0]

        return { ...el, rectPosition }
      })
    )
  }, [setNodes])

  EditorPublicApi.update({
    transformation,
    recalculateRects,
    setTransformation,
    stateNodes
  })

  useEffect(() => {
    if (!_.isEqual(_.omit(nodes, ["children"]), _.omit(stateNodes, ["children"]))) setNodes(nodes)
    if (pointPosition && !_.isEqual(pointPosition, pointStatePosition)) setPointStatePosition(pointPosition)
    if (inputPosition && !_.isEqual(inputPosition, inputStatePosition)) setInputStatePosition(inputPosition)
  }, [nodes, pointPosition, inputPosition])

  const onDragEnded = () => {
    setAutoScroll({ speed: 0, direction: null })
    if (currentDragItem.type === ItemType.connection) {
      const outputNode = stateNodes.find((currentElement) => hoveredNodeId === currentElement.id)

      if (outputNode) {
        setNodes((nodesState) =>
          nodesState.map((el) => {
            const input = isSingleOutputConnection ? [outputNode.id] : [...el.input, outputNode.id]
            return el.id === selectedNodeId && !el.input.includes(outputNode.id) ? { ...el, input } : el
          })
        )
      }
    }
    setNewConnectionState(undefined)
    setDragItem((dragItem) => ({ ...dragItem, type: undefined }))
    setDraggableNode(undefined)
  }

  useEffect(() => {
    if (!autoScroll.direction) return

    const getSign = (axis: Axis) => {
      if (axis === Axis.x && autoScroll.direction === AutoScrollDirection.left) return -1
      if (axis === Axis.x && autoScroll.direction === AutoScrollDirection.right) return 1

      if (axis === Axis.y && autoScroll.direction === AutoScrollDirection.top) return -1
      if (axis === Axis.y && autoScroll.direction === AutoScrollDirection.bottom) return 1

      return 0
    }

    const delta = DRAG_AUTO_SCROLL_DIST * autoScroll.speed

    const scroll = () => {
      if ([ItemType.node, ItemType.connection].includes(currentDragItem.type)) {
        const dx = transformation.dx - getSign(Axis.x) * delta * transformation.zoom
        const dy = transformation.dy - getSign(Axis.y) * delta * transformation.zoom

        setTransformation({
          ...transformation,
          dx,
          dy
        })
      }

      if (currentDragItem.type === ItemType.connection) {
        setNewConnectionState({
          x: newConnection.x + getSign(Axis.x) * delta,
          y: newConnection.y + getSign(Axis.y) * delta
        })
      }

      if (currentDragItem.type === ItemType.node) {
        const draggingNode = stateNodes.find((node) => node.id === draggableNodeId)

        setNodes((stateNodes) =>
          stateNodes.map((el) =>
            el.id === draggableNodeId
              ? {
                  ...el,
                  position: {
                    x: draggingNode.position.x + getSign(Axis.x) * delta,
                    y: draggingNode.position.y + getSign(Axis.y) * delta
                  }
                }
              : el
          )
        )
      }
    }

    const scrollInterval = setInterval(scroll, DRAG_AUTO_SCROLL_TIME)

    return () => clearInterval(scrollInterval)
  }, [autoScroll, currentDragItem, newConnection, stateNodes, transformation])

  const onDrag = (e: React.MouseEvent<HTMLElement>) => {
    if (currentDragItem.type === ItemType.connection && !autoScroll.direction) {
      const newPos = {
        x: newConnection.x + (e.clientX - currentDragItem.x) / transformation.zoom,
        y: newConnection.y + (e.clientY - currentDragItem.y) / transformation.zoom
      }

      setNewConnectionState(newPos)
    }

    if (currentDragItem.type === ItemType.viewPort) {
      const newPos = { x: e.clientX, y: e.clientY }
      const offset = { x: newPos.x - currentDragItem.x, y: newPos.y - currentDragItem.y }

      setTransformation({
        ...transformation,
        dx: transformation.dx + offset.x,
        dy: transformation.dy + offset.y
      })

      recalculateRects()
    }

    if (currentDragItem.type === ItemType.node && !autoScroll.direction) {
      const draggingNode = stateNodes.find((node) => node.id === draggableNodeId)

      const rectPosition = document.getElementById(draggableNodeId).getClientRects()[0]

      const newPos = {
        x: draggingNode.position.x + (e.clientX - currentDragItem.x) / transformation.zoom,
        y: draggingNode.position.y + (e.clientY - currentDragItem.y) / transformation.zoom
      }

      setNodes((stateNodes) =>
        stateNodes.map((el) => (el.id === draggableNodeId ? { ...el, position: newPos, rectPosition } : el))
      )
    }

    if ([ItemType.node, ItemType.connection].includes(currentDragItem.type)) {
      const leftOverflow = offset.offsetLeft + DRAG_OFFSET_TRANSFORM - e.clientX
      const rightOverflow = e.clientX - (offset.maxRight - DRAG_OFFSET_TRANSFORM)
      const topOverflow = offset.offsetTop + DRAG_OFFSET_TRANSFORM - e.clientY
      const bottomOverflow = e.clientY - (offset.maxBottom - DRAG_OFFSET_TRANSFORM)

      if (leftOverflow > 0) {
        setAutoScroll({ speed: leftOverflow / DRAG_OFFSET_TRANSFORM, direction: AutoScrollDirection.left })
      }

      if (rightOverflow > 0) {
        setAutoScroll({ speed: rightOverflow / DRAG_OFFSET_TRANSFORM, direction: AutoScrollDirection.right })
      }

      if (topOverflow > 0) {
        setAutoScroll({ speed: topOverflow / DRAG_OFFSET_TRANSFORM, direction: AutoScrollDirection.top })
      }

      if (bottomOverflow > 0) {
        setAutoScroll({ speed: bottomOverflow / DRAG_OFFSET_TRANSFORM, direction: AutoScrollDirection.bottom })
      }

      if (autoScroll.direction && Math.max(leftOverflow, rightOverflow, topOverflow, bottomOverflow) <= 0) {
        setAutoScroll({ speed: 0, direction: null })
      }
    }

    setDragItem((dragItem) => ({ ...dragItem, x: e.clientX, y: e.clientY }))
  }

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Delete" && selectedNodeId) {
      setNodes((stateNodes) => stateNodes.filter(({ id }) => selectedNodeId !== id))
    }
  }

  useEffect(() => {
    if (!stateNodes.length) return

    recalculateRects()
  }, [transformation.zoom])

  const onWheel: React.WheelEventHandler<HTMLDivElement> = (event) => {
    if (currentDragItem.type) return

    const zoomFactor = Math.pow(ZOOM_STEP, Math.sign(event.deltaY))
    const zoom = transformation.zoom * zoomFactor

    setTransformation({ ...transformation, zoom })
  }

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.button === BUTTON_LEFT && !currentDragItem.type) {
      setDragItem({ type: ItemType.viewPort, x: e.clientX, y: e.clientY })
    }
  }

  const containerRef = useCallback((element) => {
    if (element !== null) {
      const rect = element.getBoundingClientRect()

      setOffset({
        offsetLeft: rect?.left || 0,
        offsetTop: rect?.top || 0,
        maxRight: rect?.right || 0,
        maxBottom: rect?.bottom || 0
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

export const Editor: React.FC<EditorProps> = React.memo(
  ({ nodes, pointPosition, inputPosition, isSingleOutputConnection }) => {
    return (
      <RecoilRoot>
        <Canvas
          nodes={nodes}
          pointPosition={pointPosition}
          inputPosition={inputPosition}
          isSingleOutputConnection={isSingleOutputConnection}
        />
      </RecoilRoot>
    )
  }
)
