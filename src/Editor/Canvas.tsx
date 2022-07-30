import React, { useEffect, useCallback, useContext } from "react"
import _ from "lodash"
import {
  dragItemState,
  newConnectionState,
  dotSizeState,
  autoScrollState,
  hoveredNodeIdState,
  selectionZoneState
} from "./ducks/store"
import { Container as ConnectionContainer } from "./components/Connections/Container"
import { useRecoilState, useRecoilValue } from "recoil"
import Background from "./components/Background"
import { NodeContainer } from "./components/Nodes/NodesContainer"
import { BUTTON_LEFT, ZOOM_STEP, CLASSES } from "./constants"
import { EditorContext } from "./Editor"
import { ItemType } from "./types"
import { useAutoScroll } from "./helpers/autoScroll"
import { cornersToRect, isNodeInSelectionZone } from "./helpers/selectionZone"
import { useEditorMount } from "./helpers"

export const Canvas: React.FC = () => {
  const { nodes, transformation, onSelectionZoneChanged, setNodes, setTransformation, isSingleOutputConnection } =
    useContext(EditorContext)

  const [currentDragItem, setDragItem] = useRecoilState(dragItemState)
  const [newConnection, setNewConnectionState] = useRecoilState(newConnectionState)
  const [dotSize, setDotSize] = useRecoilState(dotSizeState)
  const [selectionZone, setSelectionZone] = useRecoilState(selectionZoneState)
  const [autoScroll, setAutoScroll] = useRecoilState(autoScrollState)
  const hoveredNodeId = useRecoilValue(hoveredNodeIdState)

  const { zoomContainerRef, editorContainerRef } = useEditorMount()

  useEffect(() => {
    onSelectionZoneChanged(cornersToRect(selectionZone))
  }, [selectionZone])

  const recalculateRects = useCallback(() => {
    setNodes((nodes) =>
      nodes.map((el) => ({ ...el, rectPosition: document.getElementById(el.id).getBoundingClientRect() }))
    )
  }, [setNodes])

  const onDragEnded = () => {
    setAutoScroll({ speed: 0, direction: null })
    if (currentDragItem.type === ItemType.connection) {
      const inputNode = nodes.find((currentElement) => hoveredNodeId === currentElement.id)
      const selectedNode = nodes.filter((node) => node.isSelected)
      const outputNode = selectedNode.length === 1 ? selectedNode[0] : null

      if (inputNode && outputNode) {
        setNodes((nodesState) =>
          nodesState.map((el) =>
            el.id === outputNode.id && !el.next.includes(inputNode.id)
              ? { ...el, input: isSingleOutputConnection ? [inputNode.id] : [...el.next, inputNode.id] }
              : el
          )
        )
      }
    }
    setNewConnectionState(undefined)
    setDragItem((dragItem) => ({ ...dragItem, type: undefined }))
    setSelectionZone(null)
  }

  const checkAutoScrollEnable = useAutoScroll(editorContainerRef)

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
      const draggingNodesIds = nodes.filter((node) => node.isSelected).map((node) => node.id)

      setNodes((nodes) =>
        nodes.map((el) =>
          draggingNodesIds.includes(el.id)
            ? {
                ...el,
                position: {
                  x: el.position.x + (e.clientX - currentDragItem.x) / transformation.zoom,
                  y: el.position.y + (e.clientY - currentDragItem.y) / transformation.zoom
                },
                rectPosition: document.getElementById(el.id).getClientRects()[0]
              }
            : el
        )
      )
    }

    if (currentDragItem.type === ItemType.selectionZone && !autoScroll.direction) {
      setSelectionZone((zone) => {
        const deltaX = (e.clientX - currentDragItem.x) / transformation.zoom
        const deltaY = (e.clientY - currentDragItem.y) / transformation.zoom

        return {
          ...zone,
          cornerEnd: {
            x: zone.cornerEnd.x + deltaX,
            y: zone.cornerEnd.y + deltaY
          }
        }
      })

      setNodes((nodes) =>
        nodes.map((el) => ({ ...el, isSelected: isNodeInSelectionZone(el, selectionZone, transformation) }))
      )
    }

    if ([ItemType.node, ItemType.connection, ItemType.selectionZone].includes(currentDragItem.type)) {
      checkAutoScrollEnable(e)
    }

    setDragItem((dragItem) => ({ ...dragItem, x: e.clientX, y: e.clientY }))
  }

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (["Delete", "Backspace"].includes(e.key)) {
      setNodes((nodes) => nodes.filter((node) => !node.isSelected))
    }
  }

  useEffect(() => {
    if (!nodes.length) return

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
      setDragItem({ type: e.shiftKey ? ItemType.selectionZone : ItemType.viewPort, x: e.clientX, y: e.clientY })

      if (e.shiftKey && zoomContainerRef.current) {
        const zoomContainerRect = zoomContainerRef.current.getBoundingClientRect()
        const left = (e.clientX - zoomContainerRect.left) / transformation.zoom
        const top = (e.clientY - zoomContainerRect.top) / transformation.zoom
        const point = { x: left, y: top }

        setSelectionZone({ cornerStart: point, cornerEnd: point })
      }
    }

    if (!currentDragItem.type) {
      setNodes((nodes) => nodes.map((node) => ({ ...node, isSelected: false })))
    }
  }

  useEffect(() => {
    if (!dotSize.height && !dotSize.width && nodes.length) {
      const rect = document.getElementById(`dot-${_.first(nodes).id}`)?.getBoundingClientRect()

      rect && setDotSize(rect)
    }
  }, [dotSize, nodes])

  return (
    <div
      onMouseUp={onDragEnded}
      onMouseMove={currentDragItem.type ? onDrag : undefined}
      onWheel={onWheel}
      onKeyDown={onKeyDown}
      onMouseDown={onMouseDown}
      tabIndex={0}
      ref={editorContainerRef}
      className={CLASSES.EDITOR}
    >
      <div
        ref={zoomContainerRef}
        className={CLASSES.ZOOM_CONTAINER}
        style={{ transform: `translate(${transformation.dx}px, ${transformation.dy}px) scale(${transformation.zoom})` }}
      >
        <NodeContainer />
        <ConnectionContainer />
      </div>
      <Background />
    </div>
  )
}
