[RecordTree](../../../../README.md) / [RecordTree](../README.md) / traversePreOrder

# Function: traversePreOrder()

> **traversePreOrder**(`params`, `callback`): `any`

Traverses an n-ary tree using a pre-order depth first search

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | { `callback?`: `Function`; `node`: `GlideRecord`; `parentField?`: `string`; `stackPath?`: `any`\[]; } | named function parameters |
| `params.callback?` | `Function` | function to call for each node visited |
| `params.node` | `GlideRecord` | the current node being processed |
| `params.parentField?` | `string` | name of the parent reference field |
| `params.stackPath?` | `any`\[] | array of node sys\_ids representing the current path of nodes already visited |
| `callback` | `any` | - |

## Returns

`any`
