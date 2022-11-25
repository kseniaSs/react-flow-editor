import { action } from "nanostores"

import { NodeState } from "@/types"

import { NodesAtom } from "./store"

export const changeNodeState = action(NodesAtom, "changeNodeState", (store, nodeId: string, nodeState: NodeState) => {
  store.set(store.get().map((node) => (node.id === nodeId ? { ...node, nodeState } : node)))
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
