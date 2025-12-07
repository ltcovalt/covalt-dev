[RecordTree](../../../../README.md) / [Tree](../README.md) / getRootNode

# Function: getRootNode()

> **getRootNode**(`params`): `GlideRecord`

returns the root node of a given node

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | { `node`: `GlideRecord`; `parentField?`: `string`; } | named function parameters |
| `params.node` | `GlideRecord` | the current node being processed |
| `params.parentField?` | `string` | name of the parent reference field |

## Returns

`GlideRecord`

the root node of the tree
