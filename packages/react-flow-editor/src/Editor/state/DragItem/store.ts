import { ItemType } from "@/Editor/types"
import { Output, Point } from "@/types"
import { atom } from "nanostores"

export type DragItemState = { type?: ItemType; output?: Output; id?: string } & Point

export const DragItemAtom = atom<DragItemState>({
  type: undefined,
  output: undefined,
  id: undefined,
  x: 0,
  y: 0
})
