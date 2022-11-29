# Changelog

### Version 1.0.4

##### Style fixes

- Disabled node state added. Node is disabled when it has no enough inputs.

### Version 1.0.3

##### Style fixes

- Cursor has grabbing style if node state is dragging. Also dragging node z-index was increased.

##### Functionality fixes

- Canvas mouseDown capture on drilling

### Version 1.0.2

##### style fixes

- wrong key in changeNodeState function, must be `node`.

### Version 1.0.1

##### style fixes

- remove styleConfig, replace it with connectorStyleConfig.

### Version 1.0.0

##### Global refactor

- New API break everything.

### Version 0.7.60

##### Fix cycle connection

- Fix connection connection within one node.

### Version 0.7.59

##### Important Node Ids

- Added importantNodeIds, that's cannot be deleted.

### Version 0.7.57

##### Visual changes

- Selected and hovered nodes points are now have highlighted border..

### Version 0.7.54

##### Api changes

- From that moment `next`, `outputPosition`, `outputNumber` node props were replaced by `outputs` prop that contains array of outputs (next node id and point position).
- Colors for connected and disconnected points were provided to point config in `styleConfig`.

##### Visual changes

- Diconnected points have received it's own style.

### Version 0.7.53

##### Refactor

- Circular dependencies have been fixed and eslint no-circular rule has been applied.
- Eslint security plugin has been applied.
- Snyk warnings have been fixed and snyk has been added to pipeline.
- Small performance issues was fixed.

### Version 0.7.52

##### Api changes

- Lib was rewritten on the external managing. `nodes`, `transformation` and it's setters must be driven outside the lib.
- `styleConfig` added to `Editor` props to customize points and connectors by props.
- `onEditorRectsMounted` added to `Editor` props to give outer code the access to the main size rects of the library. Also it's argument contains `overview` function to place all the nodes into viewPort.
- `onSelectionZoneChanged` added to `Editor` props to provide the ability to subscribe on selection zone coordinates change.
- `nodes` item contains props to manage input/output max number and it's positions, also added `state` field to be aware of the node status (`dragging`/`draggingConnector`/`connectorHovered`/`selected`/`null`).
- `nodes` `children` prop is now `React.FC` that receives all the node fields as props and also `onSizeChanged` function to force recalculate connectors position after node size changes.

##### Functionality

- Connectors could be disconnected by both sides. The are no duplicates while disconnectiong.
- Each connector has it's own point.
- Each node has only one input.

##### Refactor

- All the DnD transformations are now placed in `src/Editor/helpers/DnD`.
- All the autosScroll transformations are now placed in `src/Editor/helpers/autoscroll`.
- All the zoom transformations are now placed in `src/Editor/helpers/zoom`.
- All the selection zone transformations are now placed in `src/Editor/helpers/selectionZone`.
- All the hot keys actions are now placed in `src/Editor/helpers/hotKeys`.
