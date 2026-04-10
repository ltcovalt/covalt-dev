[Query](../../../README.md) / Query

# Query

Client-side namespace for performing arbitrary read-only GlideRecordSecure queries
without needing a bespoke AJAX script include for each query. The client-side
Query namespace is a wrapper around the QueryAjax utility to improve ease of use
by reducing boilerplate, performing response parsing, and error handling.

## Functions

| Function | Description |
| ------ | ------ |
| [records](functions/records.md) | Executes a query for records matching an encoded query. Queries are executed under the context of the current record, ensuring standard access policies and permissions are applied. |
| [recordsSync](functions/recordsSync.md) | Executes a synchronous query for records matching an encoded query. Queries are executed under the context of the current record, ensuring standard access policies and permissions are applied. |
