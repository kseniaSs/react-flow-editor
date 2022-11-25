import { useContext, useEffect } from "react"

import { EditorContext } from "../context"

/**
 * @deprecated
 * Will be removed
 */
export const useEditorRectsMounted = ({
  zoomContainerRef,
  editorContainerRef
}: {
  zoomContainerRef: React.RefObject<HTMLDivElement>
  editorContainerRef: React.RefObject<HTMLDivElement>
}) => {
  const { onEditorRectsMounted } = useContext(EditorContext)

  useEffect(() => {
    if (onEditorRectsMounted) {
      onEditorRectsMounted({ zoomContainerRef, editorContainerRef })
    }
  }, [])
}
