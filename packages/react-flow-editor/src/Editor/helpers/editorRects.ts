import { useEffect, useRef, useState } from "react"

const findZoomContainer = () => document.querySelector<HTMLDivElement>(".zoom-container")
const findEditorContainer = () => document.querySelector<HTMLDivElement>(".react-flow-editor")

export const useEditorRects = () => {
  const zoomContainerRef = useRef<HTMLDivElement | null>(findZoomContainer())
  const editorContainerRef = useRef<HTMLDivElement | null>(findEditorContainer())

  const [rects, setRects] = useState({
    editorContainer: editorContainerRef.current,
    zoomContainer: zoomContainerRef.current
  })

  useEffect(() => {
    if (rects.editorContainer !== editorContainerRef.current || rects.zoomContainer !== zoomContainerRef.current)
      setRects({
        editorContainer: editorContainerRef.current,
        zoomContainer: zoomContainerRef.current
      })
  })

  return { rects, zoomContainerRef, editorContainerRef }
}
