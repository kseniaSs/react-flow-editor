import { newConnectionActions, nodeActions, transformationActions } from "@/Editor/state"

import { DragItemType } from "../../types"
import { getDOMRect } from "../getDOMRect"

export const useDragTransformations = ({
  expandSelectionZone,
  zoomContainerRef
}: {
  expandSelectionZone: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  zoomContainerRef: React.RefObject<HTMLDivElement>
}) => {
  const zoomRect = getDOMRect(zoomContainerRef.current)

  return {
    [DragItemType.connection]: (e: React.MouseEvent<HTMLElement>) => {
      newConnectionActions.dragNewConnectionHandler(e, zoomRect)
    },

    [DragItemType.viewPort]: (e: React.MouseEvent<HTMLElement>) => {
      transformationActions.dragViewportHandler(e)
    },
    [DragItemType.node]: (e: React.MouseEvent<HTMLElement>) => {
      nodeActions.dragNodeHandler(e)
    },
    [DragItemType.selectionZone]: (e: React.MouseEvent<HTMLElement>) => {
      expandSelectionZone(e)
      nodeActions.dragSelectionZoneHandler()
    }
  }
}
