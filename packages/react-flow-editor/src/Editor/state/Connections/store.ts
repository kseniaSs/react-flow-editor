import { map } from "nanostores"

import { ActiveConnection } from "@/types"

export const SelectedConnectionAtom = map<ActiveConnection>([])

export const HoveredConnectionAtom = map<ActiveConnection>([])
