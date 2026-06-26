[Check](../README.md) / CheckDetail

# Interface: CheckDetail

details the results of each predicate check performed

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="abort"></a> `abort` | `boolean` | set to true when a predicate fails, skipping remaining predicates for the current check |
| <a id="actual"></a> `actual` | `any` | the actual value received |
| <a id="exception"></a> `exception` | `boolean` | true if the predicate threw an exception |
| <a id="expected"></a> `expected` | `any` | the expected value |
| <a id="invert"></a> `invert` | `boolean` | true if the check result should be inverted |
| <a id="message"></a> `message?` | `string` | additional information about the status |
| <a id="name"></a> `name` | `string` | the name or label of the value being checked |
| <a id="pass"></a> `pass` | `boolean` | true if the check was passed |
| <a id="predicate"></a> `predicate` | `string` | name of the predicate function that was ran |
| <a id="status"></a> `status` | `"pass"` | `"fail"` | `"skip"` | `"error"` | status of a predicate evaluation |
