[Query](../../../README.md) / Query

# Query

Server-side namespace for performing arbitrary GlideRecordSecure queries.
Should not typically be invoked directly. This script primarily exists to
adapt queries from the QueryAjax utility to a standard GlideRecordSecure query,
allowing clients to retrieve server data without bespoke AJAX script includes.
Records are returned as plain JavaScript objects containing only the specified fields.

## Functions

| Function | Description |
| ------ | ------ |
| [records](functions/records.md) | Executes a GlideRecord query and returns an array of objects containing only the requested columns. Can also be used to retrieve dotwalked values. |
