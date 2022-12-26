import { action } from "nanostores"

import { NodeState } from "@/types"
import { DragItemAtom } from "@/Editor/state/DragItem"
import { TransformationMap } from "@/Editor/state/Transformation"

import { NodesAtom } from "../store"

export const dragNodeHandler = action(NodesAtom, "changeNodeState", (store, e: React.MouseEvent<HTMLElement>) => {
  const dragItem = DragItemAtom.get()
  const transformation = TransformationMap.get()

  store.set(
    store.get().map((el) => {
      const isDragging = el.id === dragItem.id
      const isShiftSelected = e.shiftKey && el.state === NodeState.selected

      return isDragging || isShiftSelected
        ? {
            ...el,
            position: {
              x: el.position.x + (e.clientX - dragItem.x) / transformation.zoom,
              y: el.position.y + (e.clientY - dragItem.y) / transformation.zoom
            },
            state: isShiftSelected ? NodeState.selected : NodeState.dragging
          }
        : { ...el, state: null }
    })
  )
})
