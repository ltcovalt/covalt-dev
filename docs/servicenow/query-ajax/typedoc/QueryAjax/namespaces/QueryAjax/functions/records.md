[QueryAjax](../../../../README.md) / [\_QueryAjax](../README.md) / records

# Function: records()

> **records**(): `string`

Executes a query for records matching the encoded query. Provides a simple
interface for clients to query arbitrary records from the server, while
ensuring access policy and permissions are applied.

## Returns

`string`

## Example

```ts
let params = {
  table: 'sys_user',
  query: 'active=true^manager!=null',
  columns: ['user_name', 'manager.user_name'],
};

let ga = new GlideAjax('QueryAjax');
ga.addParam('sysparm_name', 'records');
ga.addParam('sysparm_params', JSON.stringify(params));
ga.getXMLAnswer((result) => {
  console.log(result);
});

// OUTPUT:
// {
//   "table": "sys_user",
//   "query": "active=true^manager!=null",
//   "status": "success",
//   "records": [
//     {
//       "user_name": "melinda.carleton",
//       "manager": {
//         "user_name": "lucius.bagnoli"
//     }
//   ]
// }
```
