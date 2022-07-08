import { atom } from "recoil"

export const gridState = atom({
    key: "gridSizeAtom", // unique ID (with respect to other atoms/selectors)
    default: {width: 0, height: 0} // default value (aka initial value)
})