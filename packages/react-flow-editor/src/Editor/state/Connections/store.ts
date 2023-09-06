import { map } from "nanostores"

import { Connections } from "@/types"

export const ConnectionsAtom = map<Connections>({
  selectedConnection: [],
  hoveredConnection: []
})
