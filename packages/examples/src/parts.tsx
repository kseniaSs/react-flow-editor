import * as React from "react"
import { Node, NodeProps } from "@kseniass/react-flow-editor"
import { SimpleNodeProps } from "./types"
import { omit } from "lodash"

export const NodeAttributes: React.FC<{ nodes: Node[] }> = ({ nodes }) => (
  <div>
    <h2>Nodes attributes</h2>
    {nodes.map((node) => (
      <pre key={node.id}> {JSON.stringify(omit(node, ["children"], null, 1)).replaceAll(/([{,])/g, "$1\n")}</pre>
    ))}
  </div>
)

export const SimpleNode = (): React.FC<SimpleNodeProps> => (props: NodeProps) => <NodeExpanded {...props} />

export const NodeExpanded: React.FC<SimpleNodeProps> = () => <div>Node</div>
