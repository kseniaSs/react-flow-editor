import React, { useEffect } from "react"
import {RecoilRoot, useRecoilState} from "recoil";
import _ from "lodash"
import { EditorProps } from "./types"
import Canvas from "./Canvas"
import {inputPositionState, nodesState, pointPositionState} from "./ducks/store";

const App: React.FC<EditorProps> =
    ({ nodes, pointPosition, inputPosition, onSelectionZoneChanged, isSingleOutputConnection }) => {
        const [pointStatePosition, setPointStatePosition] = useRecoilState(pointPositionState)
        const [inputStatePosition, setInputStatePosition] = useRecoilState(inputPositionState)
        const [stateNodes, setNodes] = useRecoilState(nodesState)

        useEffect(() => {
            if (!_.isEqual(_.omit(nodes, ["children"]), _.omit(stateNodes, ["children"]))) setNodes(nodes)
            if (pointPosition && !_.isEqual(pointPosition, pointStatePosition)) setPointStatePosition(pointPosition)
            if (inputPosition && !_.isEqual(inputPosition, inputStatePosition)) setInputStatePosition(inputPosition)
        }, [nodes, pointPosition, inputPosition])

        return (
            <Canvas
                onSelectionZoneChanged={onSelectionZoneChanged}
                nodes={nodes}
                pointPosition={pointPosition}
                inputPosition={inputPosition}
                isSingleOutputConnection={isSingleOutputConnection}
            />
        )
    }

export const Editor: React.FC<EditorProps> = React.memo(
    ({ nodes, pointPosition, inputPosition, onSelectionZoneChanged, isSingleOutputConnection }) => (
            <RecoilRoot>
                <App nodes={nodes} onSelectionZoneChanged={onSelectionZoneChanged} inputPosition={inputPosition} isSingleOutputConnection={isSingleOutputConnection} pointPosition={pointPosition}/>
            </RecoilRoot>
        ), _.isEqual
)
