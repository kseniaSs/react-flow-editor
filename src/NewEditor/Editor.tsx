import React from "react"
import { RecoilRoot } from "recoil"
import _ from "lodash"
import { Node as NodeType } from "../types"
import { Point as PointType } from "./types"
import Canvas from "./Canvas"

type EditorProps = {
    nodes: NodeType[]
    pointPosition?: PointType
    inputPosition?: PointType
    isSingleOutputConnection?: boolean
}

export const Editor: React.FC<EditorProps> = React.memo(
    ({ nodes, pointPosition, inputPosition, isSingleOutputConnection }) => {

        return (
            <RecoilRoot>
                <Canvas
                    nodes={nodes}
                    pointPosition={pointPosition}
                    inputPosition={inputPosition}
                    isSingleOutputConnection={isSingleOutputConnection}
                />
            </RecoilRoot>
        )
    }, _.isEqual
)
