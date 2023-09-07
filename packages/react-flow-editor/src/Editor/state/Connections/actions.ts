import { action } from "nanostores"

import { Point } from "@/types"

import { HoveredConnectionAtom, SelectedConnectionAtom } from "./store"

export const setSelectedHanlder = action(
  SelectedConnectionAtom,
  "setSelectedConnectionsHanlder",
  (store, e: [Point, Point]) => {
    store.set({
      ...store.get(),
      selectedConnection: e
    })
  }
)

export const clearSelectedHanlder = action(SelectedConnectionAtom, "removeSelectedConnectionsHanlder", (store) => {
  store.set({
    ...store.get(),
    selectedConnection: []
  })
})

export const setHoveredHanlder = action(
  HoveredConnectionAtom,
  "setHoveredConnectionsHanlder",
  (store, e: [Point, Point]) => {
    store.set({
      ...store.get(),
      hoveredConnection: e
    })
  }
)

export const clearHoveredHanlder = action(HoveredConnectionAtom, "removeHoveredConnectionsHanlder", (store) => {
  store.set({
    ...store.get(),
    hoveredConnection: []
  })
})
