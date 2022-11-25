import { createContext } from "react"

import { MountedContexts } from "./types"

export const EditorContext = createContext<any>({} as any)
export const RectsContext = createContext<MountedContexts>({} as MountedContexts)
