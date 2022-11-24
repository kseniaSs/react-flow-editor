import { NodesAtom } from "@/Editor/state/Nodes"
import { FC, useEffect } from "react"
import { Node, Transformation } from "@/types"
import { MapStore, WritableAtom } from "nanostores"
import { TransformationMap } from "./state"

type Props = {
  nodes: Node[]
  onNodesChange?: (nodes: Node[]) => void
  transformation: Transformation
  onTransfromationChange?: (tansformation: Transformation) => void
}

const synchronizeWithStore = <T extends Record<string, unknown> | Array<unknown>>(
  entity: T,
  storeEntity: WritableAtom<T> | MapStore<T>,
  updateEntity?: (entity: T) => void
) => {
  useEffect(() => {
    storeEntity.set(entity)
  }, [entity])

  useEffect(() => {
    if (updateEntity) {
      storeEntity.subscribe((value) => updateEntity(value))
    }
  }, [updateEntity])
}

/**
 * Used for sync props with inner store
 */
export const StoreUpdater: FC<Props> = ({ nodes, onNodesChange, transformation, onTransfromationChange }) => {
  synchronizeWithStore(nodes, NodesAtom, onNodesChange)

  synchronizeWithStore(transformation, TransformationMap, onTransfromationChange)

  return null
}
