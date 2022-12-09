import { FC, useEffect } from "react"
import { MapStore, WritableAtom } from "nanostores"

import { NodesAtom } from "@/Editor/state/Nodes"
import { Node, Transformation } from "@/types"

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
  let unsubCallback: (() => void) | null = null

  useEffect(() => {
    storeEntity.set(entity)
  }, [entity])

  useEffect(() => {
    if (updateEntity && !unsubCallback) {
      unsubCallback = storeEntity.subscribe((value) => updateEntity(value))
    }

    return () => {
      if (unsubCallback) {
        unsubCallback()
      }
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
