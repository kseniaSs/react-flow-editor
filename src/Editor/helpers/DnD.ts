import { MutableRefObject, useCallback, useContext } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { useRecalculateRects } from "."
import { BUTTON_LEFT } from "../constants"
import {
  autoScrollState,
  dragItemState,
  hoveredNodeIdState,
  newConnectionState,
  selectionZoneState,
  svgOffsetState
} from "../ducks/store"
import { EditorContext } from "../Editor"
import { ItemType } from "../types"
import { useAutoScroll } from "./autoScroll"
import { isNodeInSelectionZone, useSelectionZone } from "./selectionZone"

const useDragTransformations = ({
  expandSelectionZone,
  zoomContainerRef
}: {
  expandSelectionZone: (e: React.MouseEvent) => void
  zoomContainerRef: MutableRefObject<HTMLElement>
}) => {
  const { nodes, transformation, setNodes, setTransformation } = useContext(EditorContext)

  const currentDragItem = useRecoilValue(dragItemState)
  const setNewConnectionState = useSetRecoilState(newConnectionState)
  const svgOffset = useRecoilValue(svgOffsetState)
  const selectionZone = useRecoilValue(selectionZoneState)
  const recalculateRects = useRecalculateRects()

  const zoomRect = zoomContainerRef?.current?.getBoundingClientRect()

  return {
    [ItemType.connection]: (e: React.MouseEvent<HTMLElement>) => {
      const newPos = {
        x: (e.clientX - zoomRect.left) / transformation.zoom - svgOffset.x,
        y: (e.clientY - zoomRect.top) / transformation.zoom - svgOffset.y
      }

      setNewConnectionState(newPos)
    },

    [ItemType.viewPort]: (e: React.MouseEvent<HTMLElement>) => {
      const newPos = {
        x: (e.clientX - currentDragItem.x) / transformation.zoom,
        y: (e.clientY - currentDragItem.y) / transformation.zoom
      }

      setTransformation({
        ...transformation,
        dx: transformation.dx + newPos.x,
        dy: transformation.dy + newPos.y
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
  const { nodes, setNodes } = useContext(EditorContext)

  const [currentDragItem, setDragItem] = useRecoilState(dragItemState)
  const setNewConnectionState = useSetRecoilState(newConnectionState)
  const [autoScroll, setAutoScroll] = useRecoilState(autoScrollState)
  const setSelectionZone = useSetRecoilState(selectionZoneState)
  const hoveredNodeId = useRecoilValue(hoveredNodeIdState)

  const checkAutoScrollEnable = useAutoScroll(editorContainerRef)
  const { initSelectionZone, expandSelectionZone } = useSelectionZone(zoomContainerRef)

  const dragTranformations = useDragTransformations({ expandSelectionZone, zoomContainerRef })

  const onDrag = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      dragTranformations[currentDragItem.type](e)

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
      const outputNode = nodes.find((node) => node.id === currentDragItem.fromId)

      const inputIdsForInputNode = nodes.filter((node) => node.next.includes(inputNode?.id))
      const connectedPointInx = outputNode.next.findIndex((id) => id === currentDragItem.nextId)
      const isNew = connectedPointInx === -1

      if (!inputNode && outputNode && !isNew) {
        setNodes((nodesState) =>
          nodesState.map((el) => {
            if (el.id !== outputNode.id) return el

            const next = [...el.next]
            next.splice(connectedPointInx, 1)

            return {
              ...el,
              next
            }
          })
        )
      }

      if (inputNode && outputNode && inputNode.inputNumber > inputIdsForInputNode.length) {
        setNodes((nodesState) =>
          nodesState.map((el) => {
            if (el.id === outputNode.id && !el.next.includes(inputNode.id)) {
              const next = [...el.next]
              next.splice(isNew ? next.length : connectedPointInx, isNew ? 0 : 1, inputNode.id)

              return {
                ...el,
                next
              }
            }

            return el
          })
        )
      }
    }
    setNewConnectionState(undefined)
    setDragItem((dragItem) => ({ ...dragItem, type: undefined }))
    setSelectionZone(null)
  }, [currentDragItem, nodes, hoveredNodeId, setNodes])

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
