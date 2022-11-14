import { useStore } from "@nanostores/react"
import { useContext, useEffect } from "react"
import { NodeState } from "../../types"
import { KEY_CODE_BACK, KEY_CODE_DELETE } from "../constants"
import { EditorContext } from "../context"
import { NodesAtom } from "../state"

export const useHotKeys = () => {
  const { importantNodeIds } = useContext(EditorContext)
  const nodes = useStore(NodesAtom)

  useEffect(() => {
    const hotKeysHandler = (e: KeyboardEvent) => {
      if ([KEY_CODE_BACK, KEY_CODE_DELETE].includes(e.key)) {
        const selectedNodesIds = nodes
          .filter((node) => node.state === NodeState.selected)
          .filter((node) => importantNodeIds && !importantNodeIds.includes(node.id))
          .map((node) => node.id)

        NodesAtom.set(
          nodes
            .filter((node) => !selectedNodesIds.includes(node.id))
            .map((node) => ({
              ...node,
              outputs: node.outputs.map((out) => ({
                ...out,
                nextNodeId: out.nextNodeId && selectedNodesIds.includes(out.nextNodeId) ? null : out.nextNodeId
              }))
            }))
        )
      }
    }

    window.addEventListener("keydown", hotKeysHandler)

    return () => window.removeEventListener("keydown", hotKeysHandler)
  }, [nodes])
}
