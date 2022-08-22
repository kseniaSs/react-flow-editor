# Flow Editor

[![npm version](https://badge.fury.io/js/@kseniass%2Freact-flow-editor.svg)](https://www.npmjs.com/package/@kseniass/react-flow-editor)

[Try](https://kseniass.github.io/react-flow-editor/) in your browser.

## Main features

- DnD to move canvas or nodes
- Available autoScroll when DnD connection or nodes
- Multiple Selection with SHIFT + click nodes
- Multiple Selection with SHIFT and dragging select zone
- Delete (multiple too) selected nodes with DELETE/BACKSPACE
- DnD multiple selected nodes with SHIFT
- Scroll mouse to zoom
- Connectors could be disconnected from both edges
- Overview function to place all the nodes to viewPort

## API

### Editor Configuration

The editor props looks as follow

```typescript
export type EditorProps = {
  nodes: Node[]
  setNodes: (action: SetStateAction<Node[]>) => void
  transformation: Transformation
  setTransformation: (transformation: Transformation) => void
  onSelectionZoneChanged?: (value: RectZone) => void
  onEditorRectsMounted?: (value: OnEditorRectsMountedProps) => void
  styleConfig?: StyleConfig
}

export type Output = {
  id: string
  position: Point
  nextNodeId: string | null
}

export type NodeBase = {
  id: string
  outputs: Output[]
  position: Point
  rectPosition?: DOMRect
  inputPosition?: Point
  inputNumber: number
  state: NodeState | null
}

export type Node = NodeBase & {
  children: React.FC<NodeProps>
}

export type NodeProps = NodeBase & {
  onSizeChanged: () => void
}

export type Transformation = {
  dx: number
  dy: number
  zoom: number
}

export type RectZone = {
  left: number
  right: number
  top: number
  bottom: number
}

export type OnEditorRectsMountedProps = {
  zoomContainerRef: MutableRefObject<HTMLDivElement>
  editorContainerRef: MutableRefObject<HTMLDivElement>
  overview: () => void
}
```

| Prop      | Description |
| ----------- | ----------- |
| `nodes`| Array of nodes to render in editor |
| `setNodes`| Function for nodes managing |
| `transformation`| Editor translate and scale transformation  |
| `setTransformation`| Transformation managing function |
| `onEditorRectsMounted`| Callback for receiving editor DOMRect and nodes container DOMRect |
| `onSelectionZoneChanged`| Callback for receiving selection zone coordinates |
| `styleConfig`| Config of editor parts styles |


### Node

| Prop      | Description |
| ----------- | ----------- |
| `id`| The unique identifier for the node |
| `position`| Coordinates of the node |
| `rectPosition`| DOMRect for the node |
| `outputs`| Array of outputs. Each output contains data about point position (relatively to node) and connected node id.|
| `inputPosition`| Position of input point for connectors (relatively to node) |
| `inputNumber`| Max number of inputs |
| `state`| Node state |

### Node states

- `null`
- `dragging`
- `selected`
- `draggingConnector`
- `connectorHovered`

#### Rules for node states

1. node mouseDown = no changes in state
2. node mouseDown -> mouseUp = `selected`
3. node mouseDown -> mouseMove = `dragging`
4. node mouseDown -> mouseMove -> mouseUp = `null`

5. SHIFT + node mouseDown = no changes in state
6. SHIFT + (node mouseDown -> mouseUp) = `selected`
7. SHIFT + (node mouseDown-> mouseMove)  = `dragging`
8. SHIFT + (node mouseDown-> mouseMove -> mouseUp)  = `selected`

9. SHIFT + (node click -> node_2 click)  = `selected` both
10. SHIFT + (node click -> node_2 click -> (node or node_2) mouseDown -> mouseMove)  = `dragging` both
11. SHIFT + (node click -> node_2 click -> (node or node_2) mouseDown -> mouseMove -> mouseUp) = `selected` both

12. DnD from node_1 point = `draggingConnector`
13. DnD from node_1 point over node_2 point = node_1 `draggingConnector` and node_2 `connectorHovered`
14. DnD from node_1 point drop in any place = `null` for all

15. click away from nodes = `null` for all

### Transfromation

| Prop      | Description |
| ----------- | ----------- |
| `dx`| Horizontal editor offset |
| `dy`| Vertical editor offset |
| `zoom`| Editor zoom |

### Selection zone

| Prop      | Description |
| ----------- | ----------- |
| `cornerStart`| Coordinates of the start selection point |
| `cornerEnd`| Coordinates of the end selection point |


### OnEditorRectsMountedProps

| Prop      | Description |
| ----------- | ----------- |
| `zoomContainerRef`| React Ref Object of nodes container |
| `editorContainerRef`| React Ref Object of editor |
| `overview`| Function for applying transformation to place all the nodes into viewPort |

### styleConfig

| Prop      | Description |
| ----------- | ----------- |
| `point`| Point styles |
| `connector`| Connector styles |

### PointStyleConfig

| Prop      | Description |
| ----------- | ----------- |
| `width`| Point width |
| `height`| Point height |
| `color`| Point color |

### ConnectorStyleConfig

| Prop      | Description |
| ----------- | ----------- |
| `width`| Connector width |
| `color`| Connector color |


### [Changelog](./changelog.md "Changelog")
