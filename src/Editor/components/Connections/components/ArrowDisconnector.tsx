import { isEqual } from "lodash"
import React, { useCallback } from "react"
import { useSetRecoilState } from "recoil"
import { Point } from "../../../../types"
import { CLASSES } from "../../../constants"
import { dragItemState } from "../../../ducks/store"
import { ItemType } from "../../../types"
import { disconnectorStyle } from "../helpers"

type DisconnectorProps = {
  position: Point
  fromId: string
  nextId: string
}

const ArrowDisconnector: React.FC<DisconnectorProps> = ({ position, fromId, nextId }) => {
  const setDragItem = useSetRecoilState(dragItemState)

  const onMouseDown = useCallback((e) => {
    e.stopPropagation()

    setDragItem({
      type: ItemType.connection,
      nextId,
      fromId,
      x: e.clientX,
      y: e.clientY
    })
  }, [])

  return <rect onMouseDown={onMouseDown} className={CLASSES.DISCONNECTOR} style={disconnectorStyle(position)} />
}

export default React.memo(ArrowDisconnector, isEqual)
