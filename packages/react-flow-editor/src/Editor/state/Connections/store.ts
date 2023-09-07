import { map } from "nanostores"

import { HoveredConnections, SelectedConnections } from "@/types"

export const SelectedConnectionAtom = map<SelectedConnections>({
  selectedConnection: []
})

export const HoveredConnectionAtom = map<HoveredConnections>({
  hoveredConnection: []
})
