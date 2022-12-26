import { Node } from "@/types"

export const nodeRect = (node: Node) =>
  document.getElementById(node.id)?.getBoundingClientRect() || { width: 0, height: 0 }
