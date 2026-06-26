[Check](../README.md) / Check

# Function: Check()

> **Check**(`value`, `name?`): [`Checker`](../classes/Checker.md)

Factory function for the Checker class.
If a name is not provided, it accepts an object containing a single name-value pair
to extract and use as both the name and the value for the Checker instance.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `any` | the value to be checked (or a single key-value object if name is omitted) |
| `name?` | `string` | the name or label of the value being checked |

## Returns

[`Checker`](../classes/Checker.md)

a new Checker instance

## Examples

```ts
let pass = Check('hello', 'val').is.string().ok(); // true
```

```ts
let testValue = 'hello';
let pass = Check({ testValue }).is.string().ok(); // true
```
