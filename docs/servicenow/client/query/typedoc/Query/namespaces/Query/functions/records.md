[Query](../../../../README.md) / [Query](../README.md) / records

# Function: records()

> **records**(`params`, `callback?`): [`QueryResponse`](../../../../interfaces/QueryResponse.md)

Executes a query for records matching an encoded query.
Queries are executed under the context of the current record,
ensuring standard access policies and permissions are applied.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | [`QueryParams`](../../../../interfaces/QueryParams.md) | parameters defining the query |
| `callback?` | `Function` | optional callback function - query is executed asynchronously if provided |

## Returns

[`QueryResponse`](../../../../interfaces/QueryResponse.md)

returns the parsed JSON payload or null when ran asynchronously
