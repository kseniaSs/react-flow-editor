import { autoScrollActions, nodeActions, NodesAtom, SelectionZoneAtom } from "@/Editor/state"
import { useStore } from "@nanostores/react"
import { MutableRefObject } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { BUTTON_LEFT } from "../../constants"
import { dragItemState, hoveredNodeIdState } from "../../ducks/store"
import { ItemType } from "../../types"
import { useAutoScroll } from "../autoScroll"
import { useSelectionZone } from "../selectionZone"
import { useDragTransformations } from "./useDragTransformations"

export const useDnD = (
  editorContainerRef: MutableRefObject<HTMLElement>,
  zoomContainerRef: MutableRefObject<HTMLElement>
) => {
  const nodes = useStore(NodesAtom)
  const [currentDragItem, setDragItem] = useRecoilState(dragItemState)
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
    autoScrollActions.toDeafult()

    if (currentDragItem.type === ItemType.connection) {
      const inputNode = nodes.find((currentElement) => hoveredNodeId === currentElement.id)
      const outputNode = nodes.find((node) => node.id === currentDragItem.id)

      const inputIdsForInputNode = nodes.filter((node) =>
        node.outputs.map((out) => out.nextNodeId).includes(inputNode?.id)
      )
      const isNew = currentDragItem.output?.nextNodeId === null

      if (!inputNode && outputNode && isNew && nodes.some((node) => Boolean(node.state))) {
        nodeActions.clearNodesState()
      }

      if (!inputNode && outputNode && !isNew) {
        NodesAtom.set(
          nodes.map((el) => {
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
          NodesAtom.set(
            nodes.map((el) => ({
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
    setDragItem((dragItem) => ({ ...dragItem, type: undefined }))
    SelectionZoneAtom.set(null)
  }

  const onDragStarted: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.button === BUTTON_LEFT && !currentDragItem.type) {
      setDragItem({ type: e.shiftKey ? ItemType.selectionZone : ItemType.viewPort, x: e.clientX, y: e.clientY })
      initSelectionZone(e)
    }

    if (!currentDragItem.type && nodes.some((node) => Boolean(node.state))) {
      nodeActions.clearNodesState()
    }
  }

  return { onDrag, onDragEnded, onDragStarted }
}
