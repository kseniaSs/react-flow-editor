import { useEffect } from "react"

import { useEditorContext } from "../editor-context"

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
  const { onEditorRectsMounted } = useEditorContext()

  useEffect(() => {
    if (onEditorRectsMounted) {
      onEditorRectsMounted({ zoomContainerRef, editorContainerRef })
    }
  }, [])
}
