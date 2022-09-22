import React from "react"
import { RecoilRoot } from "recoil"
import { isEqual } from "lodash"
import type { EditorProps } from "@/types"
import { Canvas } from "./Canvas"
import "../_style.scss"
import { EditorContext } from "./context"

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
