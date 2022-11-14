import { NodeState } from "@/types"
import { action } from "nanostores"
import { NodesAtom } from "./store"

export const changeNodeState = action(NodesAtom, "changeNodeState", (store, nodeId: string, nodeState: NodeState) => {
  store.set(
    store.get().map((node) => ({
      ...node,
      // state: node.id === nodeId ? nodeState : null
      // May be try this?
      state: node.id === nodeId ? nodeState : node.state
    }))
  )
})

export const changeNodeRectPos = action(
  NodesAtom,
  "changeNodeRectPos",
  (store, nodeId: string, rectPosition: DOMRect) => {
    store.set(store.get().map((node) => (node.id === nodeId ? { ...node, rectPosition } : node)))
  }
)

export const clearNodesState = action(NodesAtom, "clearNodesState", (store) => {
  store.set(store.get().map((node) => ({ ...node, state: null })))
})
