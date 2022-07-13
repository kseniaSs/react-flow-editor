import React from "react"
import { Connection } from "./Connection"
import { useRecoilValue } from "recoil";
import { nodesState } from "../../ducks/store";

type ContainerProps = {

}

export const Container: React.FC<ContainerProps> = () => {
    const nodes = useRecoilValue(nodesState)

    const connectionContainerStyle = {
        pointerEvents: "none"
    }

    return <svg
        className="connections"
        xmlns="http://www.w3.org/2000/svg"
        style={connectionContainerStyle}
    >
        {nodes.map((node) => <Connection key={`${node.id}-connection`} node={node} />)}
    </svg>
}
