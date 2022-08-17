# Changelog

### Version 0.7.53

#####  Refactor

- Circular dependencies have been fixed and eslint no-circular rule has been applied.
- Eslint security plugin has been applied.
- Snyk warnings have been fixed and snyk has been added to pipeline.
- Small performance issues was fixed.
### Version 0.7.52

#####  Api changes

- Lib was rewritten on the external managing. `nodes`, `transformation` and it's setters must be driven outside the lib.
- `styleConfig` added to `Editor` props to customize points and connectors by props.
- `onEditorRectsMounted` added to `Editor` props to give outer code the access to the main size rects of the library. Also it's argument contains `overview` function to place all the nodes into viewPort.
- `onSelectionZoneChanged` added to `Editor` props to provide the ability to subscribe on selection zone coordinates change.
- `nodes` item contains props to manage input/output max number and it's positions, also added `state` field to be aware of the node status (`dragging`/`draggingConnector`/`connectorHovered`/`selected`/`null`).
- `nodes` `children` prop is now `React.FC` that receives all the node fields as props and also `onSizeChanged` function to force recalculate connectors position after node size changes.


#####  Functionality

- Connectors could be disconnected by both sides. The are no duplicates while disconnectiong.
- Each connector has it's own point.
- Each node has only one input.

#####  Refactor

- All the DnD transformations are now placed in `src/Editor/helpers/DnD`.
- All the autosScroll transformations are now placed in `src/Editor/helpers/autoscroll`.
- All the zoom transformations are now placed in `src/Editor/helpers/zoom`.
- All the selection zone transformations are now placed in `src/Editor/helpers/selectionZone`.
- All the hot keys actions are now placed in `src/Editor/helpers/hotKeys`.

