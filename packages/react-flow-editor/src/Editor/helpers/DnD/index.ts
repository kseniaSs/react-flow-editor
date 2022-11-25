import { useStore } from "@nanostores/react"

import {
  autoScrollActions,
  DragItemAtom,
  HoveredNodeIdAtom,
  nodeActions,
  NodesAtom,
  SelectionZoneAtom
} from "@/Editor/state"

import { BUTTON_LEFT } from "../../constants"
import { DragItemType } from "../../types"
import { useAutoScroll } from "../autoScroll"
import { useSelectionZone } from "../selectionZone"
import { useDragTransformations } from "./useDragTransformations"

export default ({
  zoomContainerRef,
  editorContainerRef
}: {
  zoomContainerRef: React.RefObject<HTMLDivElement>
  editorContainerRef: React.RefObject<HTMLDivElement>
}) => {
  const nodes = useStore(NodesAtom)
  const hoveredNodeId = useStore(HoveredNodeIdAtom)
  const dragItem = useStore(DragItemAtom)

  const checkAutoScrollEnable = useAutoScroll(editorContainerRef)
  const { initSelectionZone, expandSelectionZone } = useSelectionZone(zoomContainerRef)
  const dragTranformations = useDragTransformations({ expandSelectionZone, zoomContainerRef })

  const onDrag = (e: React.MouseEvent<HTMLElement>) => {
    if (!dragItem.type) return

    dragTranformations[dragItem.type](e)

    if ([DragItemType.node, DragItemType.connection, DragItemType.selectionZone].includes(dragItem.type)) {
      checkAutoScrollEnable(e)
    }

    DragItemAtom.set({ ...dragItem, x: e.clientX, y: e.clientY })
  }

  const onDragEnded = () => {
    autoScrollActions.toDeafult()

    if (dragItem.type === DragItemType.connection) {
      const inputNode = nodes.find((currentElement) => hoveredNodeId === currentElement.id)!
      const outputNode = nodes.find((node) => node.id === dragItem.id)

      const isNew = dragItem.output?.nextNodeId === null

      if (!inputNode && outputNode && isNew && nodes.some((node) => Boolean(node.state))) {
        nodeActions.clearNodesState()
      }

      if (!inputNode && outputNode && !isNew) {
        NodesAtom.set(
          nodes.map((el) => {
            if (el.id !== outputNode.id) return el

            return {
              ...el,
              outputs: el.outputs.map((out) => (out.id === dragItem.output?.id ? { ...out, nextNodeId: null } : out)),
              state: null
            }
          })
        )
      }

      const inputIdsForInputNode = nodes.filter((node) =>
        node.outputs.map((out) => out.nextNodeId).includes(inputNode?.id)
      )

      if (inputNode && outputNode && inputNode.inputNumber > inputIdsForInputNode.length) {
        const alreadyConnected = outputNode.outputs.some(
          (out) => out.id !== dragItem.output?.id && out.nextNodeId === inputNode.id
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
                      out.id === dragItem.output?.id ? { ...out, nextNodeId: inputNode.id } : out
                    )
                  : el.outputs,
              state: null
            }))
          )
      }
    }

    DragItemAtom.set({ x: 0, y: 0 })
    SelectionZoneAtom.set(null)
  }

  const onDragStarted: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.button === BUTTON_LEFT && !dragItem.type) {
      if (e.shiftKey) {
        DragItemAtom.set({ type: DragItemType.selectionZone, x: e.clientX, y: e.clientY })
      } else {
        DragItemAtom.set({ type: DragItemType.viewPort, x: e.clientX, y: e.clientY })
      }

      initSelectionZone(e)
    }

    if (!dragItem.type && nodes.some((node) => Boolean(node.state))) {
      nodeActions.clearNodesState()
    }
  }

  return { onDrag, onDragEnded, onDragStarted }
}
