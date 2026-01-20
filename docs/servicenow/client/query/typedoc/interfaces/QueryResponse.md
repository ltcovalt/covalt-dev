[Query](../README.md) / QueryResponse

# Interface: QueryResponse

response object containing requested data

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="data"></a> `data?` | `any` | wrapper for data returned by the API call - if the call returns no data, data will be `null` - if status is 'fail', data contains info on failed validations - if status is 'error', data is omitted |
| <a id="message"></a> `message?` | `string` | message describing the response result - required when status is 'fail' or 'error' |
| <a id="status"></a> `status` | [`JsendStatus`](../type-aliases/JsendStatus.md) | overall status of the response |
