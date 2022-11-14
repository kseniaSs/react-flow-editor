import { Point } from "@/types"
import { atom } from "nanostores"

export const NewConnectionAtom = atom<Point>({ x: 0, y: 0 })
