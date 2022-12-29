import { useStore } from "@nanostores/react"
import { useState, useEffect } from "react"

import { getRectFromNode } from "@/Editor/helpers/getRectFromNode"
import { TransformationMap } from "@/Editor/state"
import { Node } from "@/types"

export const useNodeRect = (node?: Node) => {
  const [rect, setRect] = useState<DOMRect>(getRectFromNode(node))
  const transformationMap = useStore(TransformationMap)

  useEffect(() => setRect(getRectFromNode(node)), [node?.id, transformationMap])

  return rect
}
