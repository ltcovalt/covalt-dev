[Query](../../../../README.md) / [Query](../README.md) / records

# Function: records()

> **records**(`params`, `callback`): `void`

Executes a query for records matching an encoded query.
Queries are executed under the context of the current record,
ensuring standard access policies and permissions are applied.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | [`QueryParams`](../../../../interfaces/QueryParams.md) | parameters defining the query |
| `callback` | `Function` | callback function to invoke after a response is received |

## Returns

`void`

## Example

```ts
let params = {
  table: 'sys_user',
  query: 'active=true^manager!=null',
  columns: ['user_name', 'manager.user_name'],
};
Query.records(params, (res) => console.log(res));
```
