import { MutableRefObject, useCallback, useContext } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { useRecalculateRects } from "."
import { BUTTON_LEFT } from "../constants"
import {
  autoScrollState,
  dragItemState,
  hoveredNodeIdState,
  newConnectionState,
  selectionZoneState
} from "../ducks/store"
import { EditorContext } from "../Editor"
import { ItemType } from "../types"
import { useAutoScroll } from "./autoScroll"
import { isNodeInSelectionZone, useSelectionZone } from "./selectionZone"

const useDragTransformations = ({ expandSelectionZone }: { expandSelectionZone: (e: React.MouseEvent) => void }) => {
  const { nodes, transformation, setNodes, setTransformation } = useContext(EditorContext)

  const currentDragItem = useRecoilValue(dragItemState)
  const [newConnection, setNewConnectionState] = useRecoilState(newConnectionState)
  const selectionZone = useRecoilValue(selectionZoneState)
  const recalculateRects = useRecalculateRects()

  return {
    [ItemType.connection]: (e: React.MouseEvent<HTMLElement>) => {
      const newPos = {
        x: newConnection.x + (e.clientX - currentDragItem.x) / transformation.zoom,
        y: newConnection.y + (e.clientY - currentDragItem.y) / transformation.zoom
      }

      setNewConnectionState(newPos)
    },

    [ItemType.viewPort]: (e: React.MouseEvent<HTMLElement>) => {
      const newPos = { x: e.clientX, y: e.clientY }
      const offset = { x: newPos.x - currentDragItem.x, y: newPos.y - currentDragItem.y }

      setTransformation({
        ...transformation,
        dx: transformation.dx + offset.x,
        dy: transformation.dy + offset.y
      })

      recalculateRects()
    },
    [ItemType.node]: (e: React.MouseEvent<HTMLElement>) => {
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
                rectPosition: document.getElementById(el.id).getBoundingClientRect()
              }
            : el
        )
      )
    },
    [ItemType.selectionZone]: (e: React.MouseEvent<HTMLElement>) => {
      expandSelectionZone(e)

      setNodes((nodes) =>
        nodes.map((el) => ({ ...el, isSelected: isNodeInSelectionZone(el, selectionZone, transformation) }))
      )
    }
  }
}

export const useDnD = (
  editorContainerRef: MutableRefObject<HTMLElement>,
  zoomContainerRef: MutableRefObject<HTMLElement>
) => {
  const { nodes, setNodes, isSingleOutputConnection } = useContext(EditorContext)

  const [currentDragItem, setDragItem] = useRecoilState(dragItemState)
  const setNewConnectionState = useSetRecoilState(newConnectionState)
  const [autoScroll, setAutoScroll] = useRecoilState(autoScrollState)
  const setSelectionZone = useSetRecoilState(selectionZoneState)
  const hoveredNodeId = useRecoilValue(hoveredNodeIdState)

  const checkAutoScrollEnable = useAutoScroll(editorContainerRef)
  const { initSelectionZone, expandSelectionZone } = useSelectionZone(zoomContainerRef)

  const dragTranformations = useDragTransformations({ expandSelectionZone })

  const onDrag = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!autoScroll.direction) dragTranformations[currentDragItem.type](e)

      if ([ItemType.node, ItemType.connection, ItemType.selectionZone].includes(currentDragItem.type)) {
        checkAutoScrollEnable(e)
      }

      setDragItem((dragItem) => ({ ...dragItem, x: e.clientX, y: e.clientY }))
    },
    [autoScroll, dragTranformations, currentDragItem, checkAutoScrollEnable, setDragItem]
  )

  const onDragEnded = useCallback(() => {
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
  }, [currentDragItem, nodes, hoveredNodeId, setNodes, isSingleOutputConnection])

  const onDragStarted: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (e.button === BUTTON_LEFT && !currentDragItem.type) {
        setDragItem({ type: e.shiftKey ? ItemType.selectionZone : ItemType.viewPort, x: e.clientX, y: e.clientY })
        initSelectionZone(e)
      }

      if (!currentDragItem.type) {
        setNodes((nodes) => nodes.map((node) => ({ ...node, isSelected: false })))
      }
    },
    [currentDragItem, initSelectionZone, setNodes]
  )

  return { onDrag, onDragEnded, onDragStarted }
}
