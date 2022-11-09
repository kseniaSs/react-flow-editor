import { createContext } from "react"
import { EditorProps } from "@/types"
import { MountedContexts } from "./types"

export const EditorContext = createContext<EditorProps>({} as EditorProps)
export const RectsContext = createContext<Partial<MountedContexts>>({})
