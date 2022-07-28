import * as React from "react"
import { Node } from "@kseniass/react-flow-editor"
import _ from "lodash"

export const NodeAttributes: React.FC<{ nodes: Node[] }> = ({ nodes }) => (
  <div>
    <h2>Nodes attributes</h2>
    {nodes.map((node) => (
      <pre key={node.id}> {JSON.stringify(_.omit(node, ["children"], null, 1)).replaceAll(/([{,])/g, "$1\n")}</pre>
    ))}
  </div>
)

const NodeHeight = {
  folded: 50,
  expanded: 150
}

export const NodeExpanded: React.FC<{ recalculateRects?: () => void }> = ({ recalculateRects }) => {
  const [height, setHeight] = React.useState(NodeHeight.folded)
  const [clickCoords, setClickCoords] = React.useState({ x: 0, y: 0 })

  React.useEffect(() => {
    recalculateRects && recalculateRects()
  }, [height])

  return (
    <div
      onMouseUp={(e) =>
        clickCoords.x === e.clientX &&
        clickCoords.y === e.clientY &&
        setHeight(height === NodeHeight.folded ? NodeHeight.expanded : NodeHeight.folded)
      }
      onMouseDown={(e) => setClickCoords({ x: e.clientX, y: e.clientY })}
      style={{ height: `${height}px` }}
    >
      Expandable Node
    </div>
  )
}
