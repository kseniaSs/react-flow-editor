import { atom } from "nanostores"
import { Node } from "@kseniass/react-flow-editor"

import { initialNodes } from "./constants"

export const NodesAtom = atom<Node[]>(initialNodes)
