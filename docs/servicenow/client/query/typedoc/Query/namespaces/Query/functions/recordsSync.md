[Query](../../../../README.md) / [Query](../README.md) / recordsSync

# Function: recordsSync()

> **recordsSync**(`params`): [`QueryResponse`](../../../../interfaces/QueryResponse.md)

Executes a synchronous query for records matching an encoded query.
Queries are executed under the context of the current record,
ensuring standard access policies and permissions are applied.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | [`QueryParams`](../../../../interfaces/QueryParams.md) | parameters defining the query |

## Returns

[`QueryResponse`](../../../../interfaces/QueryResponse.md)

returns the parsed JSON payload
