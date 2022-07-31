import { first } from "lodash"
import { useCallback, useContext, useEffect, useRef } from "react"
import { useRecoilState } from "recoil"
import { Transformation } from "../../types"
import { buildDotId } from "../components/Node/helpers"
import { dotSizeState } from "../ducks/store"
import { EditorContext } from "../Editor"

export const resetEvent = (e: React.MouseEvent<HTMLElement>) => {
  e.stopPropagation()
  e.preventDefault()
}

export const useEditorMount = () => {
  const { onEditorRectsMounted, nodes } = useContext(EditorContext)

  const [dotSize, setDotSize] = useRecoilState(dotSizeState)

  const zoomContainerRef = useRef<HTMLDivElement | null>(null)
  const editorContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    onEditorRectsMounted({ zoomContainerRef, editorContainerRef })
  }, [])

  useEffect(() => {
    if (!dotSize.height && !dotSize.width && nodes.length) {
      const rect = document.getElementById(buildDotId(first(nodes).id))?.getBoundingClientRect()

      rect && setDotSize(rect)
    }
  }, [dotSize, nodes])

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
