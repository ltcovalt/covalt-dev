[RecordTree](../README.md) / traverseDfs

# Function: traverseDfs()

> **traverseDfs**(`params`): `void`

Traverses an n-ary tree using depth first search.
May optionally call a pre-order or post-order callback function.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | { `callback?`: `Function`; `node`: `GlideRecord`; `parentField?`: `string`; `postOrder?`: `boolean`; `preOrder?`: `boolean`; `stackPath?`: `any`\[]; } | named function parameters |
| `params.callback?` | `Function` | function to call for each node visited |
| `params.node` | `GlideRecord` | the current node being processed |
| `params.parentField?` | `string` | name of the parent reference field |
| `params.postOrder?` | `boolean` | if true, traverse using post-order DFS |
| `params.preOrder?` | `boolean` | if true, traverse using pre-order DFS |
| `params.stackPath?` | `any`\[] | array of node sys\_ids representing the current path of nodes already visited |

## Returns

`void`
