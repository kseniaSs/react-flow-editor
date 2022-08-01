import { useCallback, useContext, useEffect, useRef } from "react"
import { Transformation } from "../../types"
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

export const useRecalculateRects = () => {
  const { setNodes } = useContext(EditorContext)

  return useCallback(() => {
    setNodes((nodes) =>
      nodes.map((el) => ({ ...el, rectPosition: document.getElementById(el.id).getBoundingClientRect() }))
    )
  }, [setNodes])
}

export const TransformCanvasStyle = (transformation: Transformation) => ({
  transform: `translate(${transformation.dx}px, ${transformation.dy}px) scale(${transformation.zoom})`
})
