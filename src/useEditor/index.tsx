import React from "react"
import { Config } from "../types"
import { EditorState } from "../NewEditor/types"
import { Node as NodeType } from "../types"

export type EditorProps = {
  config: Config
  nodes: NodeType[]
  state: EditorState
  setState: React.Dispatch<React.SetStateAction<EditorState>>
  editorBoundingRect: DOMRect
  onEditorUpdate: (element: Element) => void
}
