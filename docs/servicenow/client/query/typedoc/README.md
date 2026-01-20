# Query

## Namespaces

| Namespace | Description |
| ------ | ------ |
| [Query](Query/namespaces/Query/README.md) | Client-side namespace for performing arbitrary GlideRecordSecure queries without needing a bespoke AJAX script include for each query. The client-side Query namespace is a wrapper around the QueryAjax utility to improve ease of use by reducing boilerplate, performing response parsing, and error handling. |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [QueryParams](interfaces/QueryParams.md) | parameters to define a query |
| [QueryResponse](interfaces/QueryResponse.md) | response object containing requested data |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [JsendStatus](type-aliases/JsendStatus.md) | JSEND formatted response status - `'success'` — request completed successfully - `'fail'` — an expected client-side validation error - `'error'` — unexpected server-side failure |
