import { useStore } from "@nanostores/react"
import { useState, useEffect } from "react"

import { nodeRect } from "@/Editor/helpers/nodeRect"
import { TransformationMap } from "@/Editor/state"
import { Node } from "@/types"

export const useNodeRect = (node: Node) => {
  const [rect, setRect] = useState<DOMRect>(nodeRect(node))
  const transformationMap = useStore(TransformationMap)

  useEffect(() => setRect(nodeRect(node)), [node.id, transformationMap])

  return rect
}
