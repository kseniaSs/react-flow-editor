import { NodesAtom } from "@/Editor/state/Nodes"
import { FC, useEffect } from "react"
import { Node } from "@/types"

type Props = {
  nodes: Node[]
  onNodesChange?: (nodes: Node[]) => void
}
/**
 * Used for sync props with inner store
 */
export const StoreUpdater: FC<Props> = ({ nodes, onNodesChange }) => {
  useEffect(() => {
    NodesAtom.set(nodes)
  }, [nodes])

  useEffect(() => {
    if (onNodesChange) {
      NodesAtom.subscribe((nodes) => onNodesChange(nodes as Node[]))
    }
  }, [onNodesChange])

  return null
}
