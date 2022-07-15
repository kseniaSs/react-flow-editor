import _ from "lodash"
import React, { useState } from "react"
import { Config } from "../types"
import { Vector2d } from "../geometry"
import { EditorState } from "../NewEditor/types"
import { Node as NodeType } from "../types"
import { RecoilRoot, useSetRecoilState } from "recoil"
import { nodesState } from "../NewEditor/ducks/store"

type UseEditorInput = {
  initialNodes: NodeType[]
  config: Config
}

export type EditorProps = {
  config: Config
  nodes: NodeType[]
  state: EditorState
  setState: React.Dispatch<React.SetStateAction<EditorState>>
  editorBoundingRect: DOMRect
  onEditorUpdate: (element: Element) => void
}

// type UseEditorOutput = {
//   editorProps: EditorProps
//   createNewNode: (newNode: NodeType, pos: Vector2d) => void
//   setTransformation: (transformation: { dx: number; dy: number; zoom: number }) => void
// }

export const useEditor = (props: UseEditorInput) => {
  // const [nodes, setNodes] = useState(props.initialNodes)
  // return {
  //   nodes,
  // }
}
