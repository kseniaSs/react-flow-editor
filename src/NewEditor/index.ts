import {Transformation} from "./types"
import {Node as NodeType} from "../types"

type PublicApiState = {
    transformation: Transformation
    setTransformation: (payload: Transformation) => void
    stateNodes: NodeType[]
    recalculateRects: () => void
}

type PublicApiInnerState = {
    apiState: PublicApiState
    callback: (state: PublicApiState) => void
}

const usePublicEditorApi = () => {
    const state: PublicApiInnerState = { apiState: null, callback: null }

    return {
        update: (payload: PublicApiState) => {
            state.apiState = payload

            if (state.callback) state.callback(state.apiState)
        },
        subscribe: (callback: (state: PublicApiState) => void) => {
            state.callback = callback

            if (state.apiState) state.callback(state.apiState)
        }
    }
}

export const EditorPublicApi = usePublicEditorApi()

export { Editor } from "./Editor"