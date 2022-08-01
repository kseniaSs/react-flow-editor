import { useContext, useEffect } from "react"
import { KEY_CODE_BACK, KEY_CODE_DELETE } from "../constants"
import { EditorContext } from "../Editor"

export const useHotKeys = () => {
  const { setNodes } = useContext(EditorContext)

  useEffect(() => {
    const hotKeysHandler = (e: KeyboardEvent) => {
      if ([KEY_CODE_BACK, KEY_CODE_DELETE].includes(e.key)) {
        setNodes((nodes) => nodes.filter((node) => !node.isSelected))
      }
    }

    window.addEventListener("keydown", hotKeysHandler)

    return () => window.removeEventListener("keydown", hotKeysHandler)
  }, [])
}
