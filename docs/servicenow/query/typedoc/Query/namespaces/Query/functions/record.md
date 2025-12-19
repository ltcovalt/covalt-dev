[Query](../../../../README.md) / [Query](../README.md) / record

# Function: record()

> **record**(`params`): `any`

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | { `columns`: `string`\[]; `limit?`: `number`; `orderBy?`: `string`; `orderByDesc?`: `string`; `query`: `string`; `table`: `string`; } | object containing parameters used by the Query API |
| `params.columns` | `string`\[] | array of column names to be included in the query |
| `params.limit?` | `number` | number of records to return, default returns all |
| `params.orderBy?` | `string` | column used to sort results in ascending order |
| `params.orderByDesc?` | `string` | column used to sort results in descending order |
| `params.query` | `string` | encoded query |
| `params.table` | `string` | table name to query |

## Returns

`any`

*
