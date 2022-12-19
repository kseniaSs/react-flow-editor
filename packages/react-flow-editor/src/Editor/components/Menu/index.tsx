import React, { FC } from "react"
import { useStore } from "@nanostores/react"

import { TransformationMap } from "@/Editor/state"
import { MenuComponentProps } from "@/types"

type Props = {
  MenuComponent: FC<MenuComponentProps>
}

export const Menu: FC<Props> = ({ MenuComponent }) => {
  const transformation = useStore(TransformationMap)

  return <MenuComponent setTransformation={TransformationMap.set} transformation={transformation} />
}
