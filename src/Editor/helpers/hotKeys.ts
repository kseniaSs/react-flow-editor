import { useContext, useEffect } from "react"
import { NodeState } from "../../types"
import { KEY_CODE_BACK, KEY_CODE_DELETE } from "../constants"
import { EditorContext } from "../context"

export const useHotKeys = () => {
  const { setNodes, nodes } = useContext(EditorContext)

  useEffect(() => {
    const hotKeysHandler = (e: KeyboardEvent) => {
      if ([KEY_CODE_BACK, KEY_CODE_DELETE].includes(e.key)) {
        const selectedNodesIds = nodes.filter((node) => node.state === NodeState.selected).map((node) => node.id)

        setNodes((nodes) =>
          nodes
            .filter((node) => !selectedNodesIds.includes(node.id))
            .map((node) => ({ ...node, next: node.next.filter((nextId) => !selectedNodesIds.includes(nextId)) }))
        )
      }
    }

    window.addEventListener("keydown", hotKeysHandler)

    return () => window.removeEventListener("keydown", hotKeysHandler)
  }, [nodes])
}
