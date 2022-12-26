import { useEffect, useState } from "react"
import { useStore } from "@nanostores/react"

import { Node } from "@/types"

import { TransformationMap } from "../state"

export const nodeRect = (node: Node) =>
  document.getElementById(node.id)?.getBoundingClientRect() || ({ width: 0, height: 0 } as DOMRect)

export const useNodeRect = (node: Node) => {
  const [rect, setRect] = useState<DOMRect>(nodeRect(node))
  const transformationMap = useStore(TransformationMap)

  useEffect(() => setRect(nodeRect(node)), [node.id, transformationMap])

  return rect
}
