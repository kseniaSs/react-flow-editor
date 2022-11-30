import { DragItemState } from "@/Editor/state"
import { DragItemType } from "@/Editor/types"
import { Node } from "@/types"

export const isNodesHaveStateToReset = (nodes: Node[], dragItem: DragItemState) =>
  nodes.some((node) => Boolean(node.state)) &&
  dragItem.type &&
  [DragItemType.viewPort, DragItemType.connection].includes(dragItem.type)
