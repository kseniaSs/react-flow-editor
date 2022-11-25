import { action } from "nanostores"

import { AutoScrollAtom } from "./store"

export const toDeafult = action(AutoScrollAtom, "restore", (store) => {
  store.set({ speed: 0, direction: null })
})
