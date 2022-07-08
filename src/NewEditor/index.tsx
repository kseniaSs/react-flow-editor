import React, {useState, useLayoutEffect, useEffect, RefObject} from "react";
import classNames from "classnames"
import { gridState } from "./ducks/store"
import { Config, Connection, Node as NodeType } from "../types"
import { ConnectionType, Endpoint, IEndpoint } from "../Endpoint"
import { initialState } from "./initialState"
import {
  atom,
  RecoilRoot, useRecoilState, useSetRecoilState
} from 'recoil';
import { EditorState } from "../Editor/types"
import { BUTTON_LEFT, BUTTON_MIDDLE, KEY_CODE_DELETE } from "./constants"
import { epPredicate, extractConnectionFromId, isEmptyArrayOrUndefined, nodeIdPredicate } from "../Editor/helpers"
import { removeConnection } from "./removeConnection"
import { CurrentAction, ItemType, WorkItem } from "./types"
import { Grid } from "./components/Grid"
import { Connections } from "./Connections"

import { Node } from "./Node"
import { adjust } from "../adjust"

export type EditorProps = {
  config: Config
  nodes: NodeType[]
  state: EditorState
  setState: React.Dispatch<React.SetStateAction<EditorState>>
  editorBoundingRect: DOMRect
  onEditorUpdate: (element: Element) => void
}

const Canvas: React.FC = () => {
  // const { state, setState, nodes, editorBoundingRect, onEditorUpdate } = props
    const setSize = useSetRecoilState(gridState)
    let elementRef: HTMLDivElement | undefined = undefined

    useEffect(() => {
        const resizeCanvas = () => {
            console.log('resize Canvas')
            if (elementRef) {
                const rect = elementRef.getClientRects()[0]
                setSize({ width: rect.width, height: rect.height })
            }
        }

        window.addEventListener("resize", resizeCanvas)

        return () => window.removeEventListener("resize", resizeCanvas)
    }, [])

    const nodesContainerStyle = {
        transform: `matrix(${state.transformation.zoom},0,0,${state.transformation.zoom},${state.transformation.dx},${state.transformation.dy})`
    }

  // const newNodes = adjust(state.nodesState, state.componentSize, props.nodes)

  // newNodes.forEach((value, key) => state.nodesState.set(key, value))
  console.log("rerender")
  return (
      <div
          ref={(element) => {
            if (element) {
                elementRef = element
              const rect = element.getClientRects()[0]
              setSize({ width: rect.width, height: rect.height })
            }
          }}
          tabIndex={0}
          className="react-flow-editor"
      >
        <Grid />
          <div style={nodesContainerStyle}>

          </div>
      </div>
  )
}

export const Editor: React.FC = React.memo(() => (
    <RecoilRoot>
      <Canvas />
    </RecoilRoot>
))
