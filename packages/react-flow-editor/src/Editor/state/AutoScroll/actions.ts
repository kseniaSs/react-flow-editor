import { action } from "nanostores"
import { AutoScrollMap } from "./store"

export const toDeafult = action(AutoScrollMap, "restore", (store) => {
  store.set({ speed: 0, direction: null })
})
