[RecordTree](../../../../README.md) / [Tree](../README.md) / \_traverseDfs

# Function: \_traverseDfs()

> **\_traverseDfs**(`params`): `void`

traverses an n-ary tree using a post-order depth first search

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
