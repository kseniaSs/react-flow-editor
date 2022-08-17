import { MutableRefObject, useCallback, useContext } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { BUTTON_LEFT } from "../../constants"
import { EditorContext } from "../../context"
import {
  autoScrollState,
  dragItemState,
  hoveredNodeIdState,
  newConnectionState,
  selectionZoneState
} from "../../ducks/store"
import { ItemType } from "../../types"
import { useAutoScroll } from "../autoScroll"
import { useSelectionZone } from "../selectionZone"
import { useDragTransformations } from "./useDragTransformations"

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

      if (!inputNode && outputNode && isNew && nodes.some((node) => Boolean(node.state))) {
        setNodes((nodesState) =>
          nodesState.map((el) => ({
            ...el,
            state: null
          }))
        )
      }

      if (!inputNode && outputNode && !isNew) {
        setNodes((nodesState) =>
          nodesState.map((el) => {
            if (el.id !== outputNode.id) return el

            const next = [...el.next]
            next.splice(connectedPointInx, 1)

            return {
              ...el,
              next,
              state: null
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
                next,
                state: null
              }
            }

            return { ...el, state: null }
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

      if (!currentDragItem.type && nodes.some((node) => Boolean(node.state))) {
        setNodes((nodes) => nodes.map((node) => ({ ...node, state: null })))
      }
    },
    [currentDragItem, initSelectionZone, nodes, setNodes]
  )

  return { onDrag, onDragEnded, onDragStarted }
}
