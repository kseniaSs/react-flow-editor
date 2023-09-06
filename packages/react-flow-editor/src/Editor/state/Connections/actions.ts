import { action } from "nanostores"

import { Point } from "@/types"

import { ConnectionsAtom } from "./store"

export const setSelectedHanlder = action(
  ConnectionsAtom,
  "setSelectedConnectionsHanlder",
  (store, e: [Point, Point]) => {
    store.set({
      ...store.get(),
      selectedConnection: e
    })
  }
)

export const clearSelectedHanlder = action(ConnectionsAtom, "removeSelectedConnectionsHanlder", (store) => {
  store.set({
    ...store.get(),
    selectedConnection: []
  })
})

export const setHoveredHanlder = action(ConnectionsAtom, "setHoveredConnectionsHanlder", (store, e: [Point, Point]) => {
  store.set({
    ...store.get(),
    hoveredConnection: e
  })
})

export const clearHoveredHanlder = action(ConnectionsAtom, "removeHoveredConnectionsHanlder", (store) => {
  store.set({
    ...store.get(),
    hoveredConnection: []
  })
})
