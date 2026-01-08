[Query](../../../../README.md) / [Query](../README.md) / records

# Function: records()

> **records**(`params`): `any`

Executes a GlideRecord query and returns an array of objects containing only
the requested columns. Can also be used to retrieve dotwalked values.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | { `columns`: `string`\[]; `limit?`: `number`; `orderBy?`: `string`; `orderByDesc?`: `string`; `query`: `string`; `table`: `string`; } | object containing parameters used by the Query API |
| `params.columns` | `string`\[] | array of column names to be included in the query |
| `params.limit?` | `number` | number of records to return, default is 100 |
| `params.orderBy?` | `string` | column used to sort results in ascending order |
| `params.orderByDesc?` | `string` | column used to sort results in descending order |
| `params.query` | `string` | encoded query |
| `params.table` | `string` | table name to query |

## Returns

`any`

result object containing records and related metadata

## Example

```ts
let result = Query.records({
  table: 'sys_user',
  query: 'active=true^manager!=null',
  columns: ['user_name', 'manager.user_name'],
  limit: 1
});
gs.info(JSON.stringify(result, null, 2));

// OUTPUT
// {
//   "table": "sys_user",
//   "query": "active=true^manager!=null",
//   "records": [
//     {
//       "user_name": "melinda.carleton",
//       "manager": {
//         "user_name": "lucius.bagnoli"
//       }
//     }
//   ]
// }
```
