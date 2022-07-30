import { useContext, useEffect, useRef } from "react"
import { EditorContext } from "../Editor"

export const resetEvent = (e: React.MouseEvent<HTMLElement>) => {
  e.stopPropagation()
  e.preventDefault()
}

export const useEditorMount = () => {
  const { onEditorRectsMounted } = useContext(EditorContext)

  const zoomContainerRef = useRef<HTMLDivElement | null>(null)
  const editorContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    onEditorRectsMounted({ zoomContainerRef, editorContainerRef })
  }, [])

  return { zoomContainerRef, editorContainerRef }
}
