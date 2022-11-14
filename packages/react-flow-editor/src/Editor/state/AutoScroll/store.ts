import { map } from "nanostores"

export enum AutoScrollDirection {
  right = "right",
  left = "left",
  top = "top",
  bottom = "bottom"
}

export type AutoScrollState = { speed: number; direction: AutoScrollDirection | null }

export const AutoScrollMap = map<AutoScrollState>({ speed: 0, direction: null })
