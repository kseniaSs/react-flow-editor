import React from "react"
import { useRecoilValue } from "recoil"
import { Node as NodeType } from "../types"

type ConnectionProps = {
    node: NodeType
}

export const Connection: React.FC<ConnectionProps> = (props) => {
    const { node } = props
    console.log("connection", node)
        return <path />
     // return  <path
     //     className="connection"
     //     key={key}
     //     strokeWidth={`${width}px`}
     //     d={cmd}
     // />
}
