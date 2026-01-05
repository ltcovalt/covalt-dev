[Check](../README.md) / Checker

# Class: Checker

Performs runtime type validation and error handling

## Contents

* [Constructors](#constructors)
  * [Constructor](#constructor)
* [Properties](#properties)
* [Accessors](#accessors)
  * [a](#a)
  * [an](#an)
  * [and](#and)
  * [are](#are)
  * [be](#be)
  * [has](#has)
  * [have](#have)
  * [is](#is)
  * [not](#not)
  * [to](#to)
* [Methods](#methods)
  * [array()](#array)
  * [between()](#between)
  * [bigint()](#bigint)
  * [boolean()](#boolean)
  * [check()](#check)
  * [date()](#date)
  * [equal()](#equal)
  * [equals()](#equals)
  * [falsy()](#falsy)
  * [finite()](#finite)
  * [float()](#float)
  * [formatError()](#formaterror)
  * [function()](#function)
  * [greater()](#greater)
  * [greaterOrEqual()](#greaterorequal)
  * [greaterThan()](#greaterthan)
  * [greaterThanOrEqual()](#greaterthanorequal)
  * [gt()](#gt)
  * [gte()](#gte)
  * [guard()](#guard)
  * [infinity()](#infinity)
  * [integer()](#integer)
  * [length()](#length)
  * [lengthBetween()](#lengthbetween)
  * [less()](#less)
  * [lessOrEqual()](#lessorequal)
  * [lessThan()](#lessthan)
  * [lessThanOrEqual()](#lessthanorequal)
  * [lt()](#lt)
  * [lte()](#lte)
  * [maxLength()](#maxlength)
  * [minLength()](#minlength)
  * [multipleOf()](#multipleof)
  * [nan()](#nan)
  * [negative()](#negative)
  * [nil()](#nil)
  * [noneOf()](#noneof)
  * [null()](#null)
  * [number()](#number)
  * [object()](#object)
  * [ok()](#ok)
  * [oneOf()](#oneof)
  * [opt()](#opt)
  * [optional()](#optional)
  * [plainObject()](#plainobject)
  * [positive()](#positive)
  * [regex()](#regex)
  * [required()](#required)
  * [result()](#result)
  * [run()](#run)
  * [string()](#string)
  * [symbol()](#symbol)
  * [truthy()](#truthy)
  * [type()](#type)
  * [typeDetail()](#typedetail)
  * [undefined()](#undefined)
  * [validRecord()](#validrecord)
  * [validTable()](#validtable)

## Constructors

### Constructor

> **new Checker**(`value`, `name`): `Checker`

Creates a new Checker object instance

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `any` | the value to be checked |
| `name` | `string` | the name or label of the value being checked |

#### Returns

`Checker`

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="abort"></a> `abort` | `boolean` | - |
| <a id="checkcount"></a> `checkCount` | `number` | - |
| <a id="checks"></a> `checks` | [`CheckDetail`](../interfaces/CheckDetail.md)\[] | array of objects detailing each check that was performed |
| <a id="errors"></a> `errors` | `string`\[] | array of objects detailing validation errors |
| <a id="invert"></a> `invert` | `boolean` | controls if the result should be inverted, used when "not" is included in the call chain |
| <a id="name"></a> `name` | `string` | name or label of the current value being processed |
| <a id="typeof"></a> `typeof` | `string` | type of the current value |
| <a id="typeofdetail"></a> `typeofDetail` | `string` | detailed typeof the current value |
| <a id="value"></a> `value` | `any` | the current value being processed |

## Accessors

### a

#### Get Signature

> **get** **a**(): `this`

No-op helper used solely to make fluent chaining more readable

##### Returns

`this`

***

### an

#### Get Signature

> **get** **an**(): `this`

No-op helper used solely to make fluent chaining more readable

##### Returns

`this`

***

### and

#### Get Signature

> **get** **and**(): `this`

No-op helper used solely to make fluent chaining more readable

##### Returns

`this`

***

### are

#### Get Signature

> **get** **are**(): `this`

No-op helper used solely to make fluent chaining more readable

##### Returns

`this`

***

### be

#### Get Signature

> **get** **be**(): `this`

No-op helper used solely to make fluent chaining more readable

##### Returns

`this`

***

### has

#### Get Signature

> **get** **has**(): `this`

No-op helper used solely to make fluent chaining more readable

##### Returns

`this`

***

### have

#### Get Signature

> **get** **have**(): `this`

No-op helper used solely to make fluent chaining more readable

##### Returns

`this`

***

### is

#### Get Signature

> **get** **is**(): `this`

No-op helper used solely to make fluent chaining more readable

##### Returns

`this`

***

### not

#### Get Signature

> **get** **not**(): `this`

Inverts the result when the next set of validations is evaluated

##### Returns

`this`

***

### to

#### Get Signature

> **get** **to**(): `this`

No-op helper used solely to make fluent chaining more readable

##### Returns

`this`

## Methods

### array()

> **array**(): `Checker`

Checks if a value is an Array

#### Returns

`Checker`

***

### between()

> **between**(`min`, `max`): `Checker`

Checks if a value is between or equal to a min and max value

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `min` | `any` |
| `max` | `any` |

#### Returns

`Checker`

#### Example

```ts
Check(3, 'Positive').is.between(0, 5); // true
Check(-3, 'Negative').is.between(0, 5); // false
Check(0, 'Zero').is.between(0, 5); // true
```

***

### bigint()

> **bigint**(): `Checker`

Checks if a value is a bigint

#### Returns

`Checker`

***

### boolean()

> **boolean**(): `Checker`

Checks if a value is a boolean

#### Returns

`Checker`

***

### check()

> **check**(`value`, `name`): `Checker`

Used to append additional checks to an existing Checker

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `any` | the value to be checked |
| `name` | `string` | name or label of the value being checked |

#### Returns

`Checker`

the current Checker instance

***

### date()

> **date**(): `Checker`

Checks if a value is a Date object.
Note that this is will only return true for a standard `Date` object instance.
It does not check if a value is a `GlideDate` or `GlideDateTime` instance

#### Returns

`Checker`

***

### equal()

> **equal**(`expected`): `Checker`

Performs a strict equality (===) check on a value

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `expected` | `any` |

#### Returns

`Checker`

#### Example

```ts
Check(1, 'number').is.equal(1).ok(); // true
Check('1', 'number').is.equal(1).ok(); // false
```

***

### equals()

> **equals**(`expected`): `Checker`

Performs a strict equality (===) check on a value.
Alias for the [equal](#equal) method.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `expected` | `any` |

#### Returns

`Checker`

#### Example

```ts
Check(1, 'number').equals(1).ok(); // true
Check('1', 'number').equals(1).ok(); // false
```

***

### falsy()

> **falsy**(): `Checker`

Coerces a value to a boolean and checks if it is a falsy value
returns {this}

#### Returns

`Checker`

#### Example

```ts
Check('string', name).is.falsy().ok(); // false
Check(true, name).is.falsy().ok(); // false
Check({}, name).is.falsy().ok(); // false
Check(0, name).is.falsy().ok(); // true
Check('', name).is.falsy().ok(); // true
Check(NaN, name).is.falsy().ok(); // true
Check(null, name).is.falsy().ok() // true
```

***

### finite()

> **finite**(): `Checker`

Checks if a value is a finite number

#### Returns

`Checker`

***

### float()

> **float**(): `Checker`

Checks if a value is a float/decimal number

#### Returns

`Checker`

***

### formatError()

> **formatError**(`detail`): `string`

Generates an error message from a CheckDetail object

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `detail` | [`CheckDetail`](../interfaces/CheckDetail.md) | detail object for the current check/predicate |

#### Returns

`string`

returns the formatted error message

***

### function()

> **function**(): `Checker`

Checks if a value is a function

#### Returns

`Checker`

***

### greater()

> **greater**(`expected`): `Checker`

Checks if a value is greater than the expected value.
Alias for [greaterThan](#greaterthan).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `expected` | `number` | the expected value |

#### Returns

`Checker`

***

### greaterOrEqual()

> **greaterOrEqual**(`expected`): `Checker`

Checks if a value is greater than or equal to the expected value.
Alias for [greaterThanOrEqual](#greaterthanorequal).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `expected` | `number` | the expected value |

#### Returns

`Checker`

***

### greaterThan()

> **greaterThan**(`expected`): `Checker`

Checks if a value is greater than the expected value.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `expected` | `number` | the expected value |

#### Returns

`Checker`

***

### greaterThanOrEqual()

> **greaterThanOrEqual**(`expected`): `Checker`

Checks if a value is greater than or equal to the expected value.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `expected` | `number` | the expected value |

#### Returns

`Checker`

***

### gt()

> **gt**(`expected`): `Checker`

Checks if a value is greater than the expected value.
Alias for [greaterThan](#greaterthan).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `expected` | `number` | the expected value |

#### Returns

`Checker`

***

### gte()

> **gte**(`expected`): `Checker`

Checks if a value is greater than or equal to the expected value.
Alias for [greaterThanOrEqual](#greaterthanorequal).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `expected` | `number` | the expected value |

#### Returns

`Checker`

***

### guard()

> **guard**(): `Checker`

Checks the current validation status and throws a TypeError if not ok

#### Returns

`Checker`

the current Checker instance

***

### infinity()

> **infinity**(): `Checker`

Checks if a value is Infinity

#### Returns

`Checker`

***

### integer()

> **integer**(): `Checker`

Checks if a value is an integer

#### Returns

`Checker`

***

### length()

> **length**(`expected`): `Checker`

Checks if the length is equal to the expected value.
Intended for use with Arrays and strings, but works with any object containing a length property.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `expected` | `number` | the expected length |

#### Returns

`Checker`

***

### lengthBetween()

> **lengthBetween**(`min`, `max`): `Checker`

Checks if the length is between an expected min and max value.
Intended for use with Arrays and strings, but works with any object containing a length property.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `min` | `number` | the minimum expected length |
| `max` | `number` | the maximum expected length |

#### Returns

`Checker`

***

### less()

> **less**(`expected`): `Checker`

Checks if a value is less than the expected value.
Alias for [lessThan](#lessthan).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `expected` | `number` | the expected value |

#### Returns

`Checker`

***

### lessOrEqual()

> **lessOrEqual**(`expected`): `Checker`

Checks if a value is less than or equal to the expected value.
Alias for [lessThanOrEqual](#lessthanorequal).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `expected` | `number` | the expected value |

#### Returns

`Checker`

***

### lessThan()

> **lessThan**(`expected`): `Checker`

Checks if a value is less than the expected value

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `expected` | `number` | the expected value |

#### Returns

`Checker`

***

### lessThanOrEqual()

> **lessThanOrEqual**(`expected`): `Checker`

Checks if a value is less than or equal to the expected value.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `expected` | `number` | the expected value |

#### Returns

`Checker`

***

### lt()

> **lt**(`expected`): `Checker`

Checks if a value is less than the expected value.
Alias for [lessThan](#lessthan).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `expected` | `number` | the expected value |

#### Returns

`Checker`

***

### lte()

> **lte**(`expected`): `Checker`

Checks if a value is less than or equal to the expected value.
Alias for [lessThanOrEqual](#lessthanorequal).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `expected` | `number` | the expected value |

#### Returns

`Checker`

***

### maxLength()

> **maxLength**(`expected`): `Checker`

Checks if the length is less than or equal to the expected maximum value.
Intended for use with Arrays and strings, but works with any object containing a length property.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `expected` | `number` | the maximum expected length |

#### Returns

`Checker`

***

### minLength()

> **minLength**(`expected`): `Checker`

Checks if the length is greater than or equal to the expected minimum value.
Intended for use with Arrays and strings, but works with any object containing a length property.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `expected` | `number` | the minimum expected length |

#### Returns

`Checker`

***

### multipleOf()

> **multipleOf**(`expected`): `Checker`

Checks if a values is a multiple of the expected value.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `expected` | `number` | number the value should be a multiple of |

#### Returns

`Checker`

***

### nan()

> **nan**(): `Checker`

Checks if a value is Not-a-Number (NaN)

#### Returns

`Checker`

***

### negative()

> **negative**(): `Checker`

Checks if a value is a negative number

#### Returns

`Checker`

#### Example

```ts
Check(3, 'Positive').is.negative(); // false
Check(-3, 'Negative').is.negative(); // true
Check(0, 'Zero').is.negative(); // false
```

***

### nil()

> **nil**(): `Checker`

Checks if a value is null or undefined

#### Returns

`Checker`

***

### noneOf()

> **noneOf**(`array`): `Checker`

Checks if a value is not present in an array of values

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `array` | `any`\[] | of values |

#### Returns

`Checker`

#### Example

```ts
Check(3).is.noneOf([1, 2, 3]).ok(); // false
Check(4).is.noneOf([1, 2, 3]).ok(); // true
```

***

### null()

> **null**(): `Checker`

Checks if a value is null

#### Returns

`Checker`

***

### number()

> **number**(): `Checker`

Checks if a value is a number

#### Returns

`Checker`

***

### object()

> **object**(): `Checker`

Checks if a value is an object

#### Returns

`Checker`

***

### ok()

> **ok**(): `boolean`

Checks the entire validation chain for errors

#### Returns

`boolean`

true if there were no validation errors

***

### oneOf()

> **oneOf**(`array`): `Checker`

Checks if a value is present in an array of values

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `array` | `any`\[] | array of allowed values |

#### Returns

`Checker`

#### Example

```ts
Check(3).is.oneOf([1, 2, 3]).ok(); // true
Check(4).is.oneOf([1, 2]).ok(); // false
```

***

### opt()

> **opt**(): `Checker`

Sets the current value being checked as optional.
Alias for [optional](#optional)

#### Returns

`Checker`

***

### optional()

> **optional**(): `Checker`

Sets the current value being checked as optional.
If invoked as `not.optional()`, delegates to [required()](#required).

#### Returns

`Checker`

***

### plainObject()

> **plainObject**(): `Checker`

Checks if a value is a plain object.
A plain object is one with a prototype of Object.prototype or null

#### Returns

`Checker`

#### Example

```ts
Check({}, 'name').is.plainObject().ok(); // true
Check(new GlideRecord, 'name').is.plainObject().ok(); // false
```

***

### positive()

> **positive**(): `Checker`

Checks if a value is a positive number

#### Returns

`Checker`

#### Example

```ts
Check(3, 'Positive').is.positive(); // true
Check(-3, 'Negative').is.positive(); // false
Check(0, 'Zero').is.positive(); // false
```

***

### regex()

> **regex**(): `Checker`

Checks if a value is a Regular Expression

#### Returns

`Checker`

***

### required()

> **required**(): `Checker`

Sets the current value being checked as required.
If invoked as not.required(), delegates to [optional()](#optional).

#### Returns

`Checker`

***

### result()

> **result**(): `any`

Returns the type validation result

#### Returns

`any`

result summary

***

### run()

> **run**(`detail`, `predicate`): `Checker`

evaluates a Type.check() call chain, finalizes pass/fail,
records full check details, and logs/throws errors,
and resets the inversion flag for the next check

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `detail` | `any` | object containing details on the current check chain |
| `predicate` | `Function` | callback function to determine if a check passed - must return a Boolean |

#### Returns

`Checker`

***

### string()

> **string**(): `Checker`

Checks if a value is a string

#### Returns

`Checker`

***

### symbol()

> **symbol**(): `Checker`

Checks if a value is a symbol

#### Returns

`Checker`

***

### truthy()

> **truthy**(): `Checker`

Coerces a value to a boolean and checks if it is a truthy value
returns {this}

#### Returns

`Checker`

#### Example

```ts
Check('string', name).is.truthy().ok(); // true
Check(true, name).is.truthy().ok(); // true
Check({}, name).is.truthy().ok(); // true
Check(0, name).is.truthy().ok(); // false
Check(null, name).is.truthy().ok() // false
```

***

### type()

> **type**(`expected`): `Checker`

Checks if the current value is the expected type

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `expected` | `any` |

#### Returns

`Checker`

#### Example

```ts
let testValue = 'Some String';
let pass = Check({ testValue }).is.type('string').ok(); // true
```

***

### typeDetail()

> **typeDetail**(`expected`): `Checker`

Checks if the detailed type of the current value is the expected type

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `expected` | `any` |

#### Returns

`Checker`

#### Examples

```ts
let testValue = new GlideRecord('sys_user');
let pass = Check({ testValue }).is.typeDetail('object (GlideRecord)'); // true
```

```ts
let testValue = {};
let pass = Check({ testValue }).is.typeDetail('object (Object)'); // true
```

***

### undefined()

> **undefined**(): `Checker`

Checks if a value is undefined

#### Returns

`Checker`

***

### validRecord()

> **validRecord**(): `Checker`

#### Returns

`Checker`

***

### validTable()

> **validTable**(): `Checker`

#### Returns

`Checker`
