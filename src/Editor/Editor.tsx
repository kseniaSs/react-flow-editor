import React from "react"
import { RecoilRoot } from "recoil"
import { isEqual } from "lodash"
import { Canvas } from "./Canvas"
import { EditorProps } from "../types"
import { EditorContext } from "./context"

import "../_style.scss"

export const Editor: React.FC<EditorProps> = React.memo(
  (props) => (
    <EditorContext.Provider value={props}>
      <RecoilRoot>
        <Canvas />
      </RecoilRoot>
    </EditorContext.Provider>
  ),
  isEqual
)
