import { Node } from "@/types"

export const getRectFromNode = (node?: Node): DOMRect => {
  const rect = node && document.getElementById(node.id)?.getBoundingClientRect()

  if (!rect) return new DOMRect()

  return rect
}
