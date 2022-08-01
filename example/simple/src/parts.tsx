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

const NodeHeight = {
  folded: 50,
  expanded: 150
}

export const SimpleNode =
  ({ expandable }: { expandable?: boolean }): React.FC<SimpleNodeProps> =>
  (props: NodeProps) =>
    <NodeExpanded expandable={expandable} {...props} />

export const NodeExpanded: React.FC<SimpleNodeProps> = ({ onSizeChanged, expandable, isSelected }) => {
  const [height, setHeight] = React.useState(NodeHeight.folded)
  const [clickCoords, setClickCoords] = React.useState({ x: 0, y: 0 })

  React.useEffect(() => {
    onSizeChanged && onSizeChanged()
  }, [height])

  return (
    <div
      className={`nodeElement ${isSelected ? "selected" : ""}`}
      onMouseUp={(e) =>
        !e.shiftKey &&
        expandable &&
        clickCoords.x === e.clientX &&
        clickCoords.y === e.clientY &&
        setHeight(height === NodeHeight.folded ? NodeHeight.expanded : NodeHeight.folded)
      }
      onMouseDown={(e) => expandable && setClickCoords({ x: e.clientX, y: e.clientY })}
      style={{ height: `${height}px` }}
    >
      {expandable && "Expandable"} Node
    </div>
  )
}
