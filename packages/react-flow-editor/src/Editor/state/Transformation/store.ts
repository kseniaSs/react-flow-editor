import { map } from "nanostores"

export type Transformation = {
  dx: number
  dy: number
  zoom: number
}

export const TransformationMap = map<Transformation>({
  dx: 0,
  dy: 0,
  zoom: 1
})
