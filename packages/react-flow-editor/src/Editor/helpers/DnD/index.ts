import { MutableRefObject, useContext } from "react"
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
  const setAutoScroll = useSetRecoilState(autoScrollState)
  const setSelectionZone = useSetRecoilState(selectionZoneState)
  const hoveredNodeId = useRecoilValue(hoveredNodeIdState)

  const checkAutoScrollEnable = useAutoScroll(editorContainerRef)
  const { initSelectionZone, expandSelectionZone } = useSelectionZone(zoomContainerRef)

  const dragTranformations = useDragTransformations({ expandSelectionZone, zoomContainerRef })

  const onDrag = (e: React.MouseEvent<HTMLElement>) => {
    dragTranformations[currentDragItem.type](e)

    if ([ItemType.node, ItemType.connection, ItemType.selectionZone].includes(currentDragItem.type)) {
      checkAutoScrollEnable(e)
    }

    setDragItem((dragItem) => ({ ...dragItem, x: e.clientX, y: e.clientY }))
  }

  const onDragEnded = () => {
    setAutoScroll({ speed: 0, direction: null })
    if (currentDragItem.type === ItemType.connection) {
      const inputNode = nodes.find((currentElement) => hoveredNodeId === currentElement.id)
      const outputNode = nodes.find((node) => node.id === currentDragItem.id)

      const inputIdsForInputNode = nodes.filter((node) =>
        node.outputs.map((out) => out.nextNodeId).includes(inputNode?.id)
      )
      const isNew = currentDragItem.output?.nextNodeId === null

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

            return {
              ...el,
              outputs: el.outputs.map((out) =>
                out.id === currentDragItem.output?.id ? { ...out, nextNodeId: null } : out
              ),
              state: null
            }
          })
        )
      }

      if (inputNode && outputNode && inputNode.inputNumber > inputIdsForInputNode.length) {
        const alreadyConnected = outputNode.outputs.some(
          (out) => out.id !== currentDragItem.output.id && out.nextNodeId === inputNode.id
        )

        const nodesAreEqual = outputNode.id === inputNode.id

        !alreadyConnected &&
          !nodesAreEqual &&
          setNodes((nodesState) =>
            nodesState.map((el) => ({
              ...el,
              outputs:
                el.id === outputNode.id
                  ? el.outputs.map((out) =>
                      out.id === currentDragItem.output.id ? { ...out, nextNodeId: inputNode.id } : out
                    )
                  : el.outputs,
              state: null
            }))
          )
      }
    }
    setNewConnectionState(undefined)
    setDragItem((dragItem) => ({ ...dragItem, type: undefined }))
    setSelectionZone(null)
  }

  const onDragStarted: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.button === BUTTON_LEFT && !currentDragItem.type) {
      setDragItem({ type: e.shiftKey ? ItemType.selectionZone : ItemType.viewPort, x: e.clientX, y: e.clientY })
      initSelectionZone(e)
    }

    if (!currentDragItem.type && nodes.some((node) => Boolean(node.state))) {
      setNodes((nodes) => nodes.map((node) => ({ ...node, state: null })))
    }
  }

  return { onDrag, onDragEnded, onDragStarted }
}