import { nodeActions } from "@/Editor/state"
import { NodeState, Point, Node, Output } from "@/types"

export const nodeStyle = (pos: Point, state: NodeState | null) => ({
  transform: `translate(${pos.x}px, ${pos.y}px)`,
  cursor: state === NodeState.dragging ? "grabbing" : "pointer",
  zIndex: state === NodeState.dragging ? 2 : 1
})

export const buildDotId = (nodeId: string) => `dot-${nodeId}`

const isNoNodeFreeInputs = (node: Node, nodes: Node[]): boolean =>
  nodes.filter((curNode) => curNode.outputs.map((out) => out.nextNodeId).includes(node.id)).length === node.inputNumber

const isSameNode = (connectableNode: Node, curNode: Node): boolean => curNode.id === connectableNode.id

export const markDisabledNodes = (connectableNode: Node, nodes: Node[]) => {
  const disabledNodesIds = nodes
    .filter((curNode) => !isSameNode(connectableNode, curNode) && isNoNodeFreeInputs(curNode, nodes))
    .map((curNode) => curNode.id)

  nodeActions.changeNodesState(disabledNodesIds, NodeState.disabled)
}
