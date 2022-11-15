import { Point, Size } from "@/types"
import { atom } from "nanostores"

export type SVGOffsetState = Point & Size

export const SvgOffsetAtom = atom<SVGOffsetState>({ x: 0, y: 0, width: 0, height: 0 })
