import React, { FC } from "react"
import { ScaleComponentProps } from "@/types"
import { useOverview } from "./useOverview"
import { useStore } from "@nanostores/react"
import { TransformationMap } from "@/Editor/state"
import { ZOOM_STEP } from "@/Editor/constants"
import { clampZoom } from "@/Editor/helpers"

type Props = {
  ScaleComponent: FC<ScaleComponentProps>
}

export const Scale: FC<Props> = ({ ScaleComponent }) => {
  const transformation = useStore(TransformationMap)

  const overview = useOverview()

  const zoomIn = () => {
    const zoom = clampZoom(transformation.zoom + ZOOM_STEP)

    TransformationMap.setKey("zoom", zoom)
  }

  const zoomOut = () => {
    const zoom = clampZoom(transformation.zoom - ZOOM_STEP)

    TransformationMap.setKey("zoom", zoom)
  }

  return <ScaleComponent zoomIn={zoomIn} zoomOut={zoomOut} overview={overview} />
}
