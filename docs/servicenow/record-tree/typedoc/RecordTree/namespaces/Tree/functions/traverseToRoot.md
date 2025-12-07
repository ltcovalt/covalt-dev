[RecordTree](../../../../README.md) / [Tree](../README.md) / traverseToRoot

# Function: traverseToRoot()

> **traverseToRoot**(`params`, `callback?`): `GlideRecord`

visits each node in a tree structure, starting from the given node and moving up to the root node

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | { `node`: `GlideRecord`; `parentField?`: `string`; `stackPath?`: `any`\[]; } | named function parameters |
| `params.node` | `GlideRecord` | the current node being processed |
| `params.parentField?` | `string` | name of the parent reference field |
| `params.stackPath?` | `any`\[] | array of node sys\_ids representing the current path of nodes already visited |
| `callback?` | `Function` | function to call for each node visited |

## Returns

`GlideRecord`

the root node of the tree
