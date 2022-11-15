import { atom } from "nanostores"

export enum AutoScrollDirection {
  right = "right",
  left = "left",
  top = "top",
  bottom = "bottom"
}

export type AutoScrollState = { speed: number; direction: AutoScrollDirection | null }

export const AutoScrollAtom = atom<AutoScrollState>({ speed: 0, direction: null })
