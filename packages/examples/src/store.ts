import { atom } from "nanostores"
import { ConnectorsBehaviour, Node } from "@kseniass/react-flow-editor"

import { initialNodes } from "./constants"

export const NodesAtom = atom<Node[]>(initialNodes)

export const ConnectorsBehaviourAtom = atom<ConnectorsBehaviour>("avoidSharpCorners")
