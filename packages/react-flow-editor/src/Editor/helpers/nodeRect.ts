import { Node } from "@/types"

export const nodeRect = (node?: Node) =>
  (node && document.getElementById(node.id)?.getBoundingClientRect()) || ({ width: 0, height: 0 } as DOMRect)
