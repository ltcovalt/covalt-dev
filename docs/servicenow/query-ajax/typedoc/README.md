# QueryAjax

Module containing methods for securely retrieving data from the server.
Queries are executed under the context of the current user via GlideRecordSecure.
Methods in the QueryAjaxAPI can be invoked directly, but most users should typically
use the client-side Query namespace defined in the global Query UI script, as it
provides a simplified interface, response parsing, and uniform error-handling.

## Namespaces

| Namespace | Description |
| ------ | ------ |
| [QueryAjaxAPI](QueryAjax/namespaces/QueryAjaxAPI/README.md) | Defines properties and methods assigned to the QueryAjax class |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [QueryParams](interfaces/QueryParams.md) | JSON Payload carried in 'sysparm\_params' that define the query |
