[Check](../README.md) / CheckDetail

# Interface: CheckDetail

details the results of each predicate check performed

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="actual"></a> `actual` | `any` | the actual value received |
| <a id="expected"></a> `expected` | `any` | the expected value |
| <a id="inverse"></a> `inverse` | `boolean` | true if the check result should be inverted |
| <a id="label"></a> `label` | `string` | user readable label for the predicate |
| <a id="pass"></a> `pass` | `boolean` | true if the check was passed |
| <a id="predicate"></a> `predicate` | `string` | name of the predicate function that was ran |
| <a id="prefix"></a> `prefix` | `string` | prefix to append to the label |
