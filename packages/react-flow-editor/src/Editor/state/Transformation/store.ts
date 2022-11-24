import { Transformation } from "@/types"
import { map } from "nanostores"

export const TransformationMap = map<Transformation>({
  dx: 0,
  dy: 0,
  zoom: 1
})
