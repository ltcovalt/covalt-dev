[Check](/docs/servicenow/check/README.md) / Checker

# Class: Checker

Performs runtime type validation and error handling

## Contents

* [Constructors](#constructors)
  * [Constructor](#constructor)
* [Properties](#properties)
* [Accessors](#accessors)
  * [are](#are)
  * [be](#be)
  * [has](#has)
  * [have](#have)
  * [is](#is)
  * [not](#not)
  * [prefix](#prefix)
  * [to](#to)
* [Methods](#methods)
  * [array()](#array)
  * [bigint()](#bigint)
  * [boolean()](#boolean)
  * [check()](#check)
  * [date()](#date)
  * [equal()](#equal)
  * [equals()](#equals)
  * [evaluate()](#evaluate)
  * [falsy()](#falsy)
  * [finite()](#finite)
  * [float()](#float)
  * [function()](#function)
  * [greater()](#greater)
  * [greaterOrEquals()](#greaterorequals)
  * [greaterThan()](#greaterthan)
  * [greaterThanOrEquals()](#greaterthanorequals)
  * [gt()](#gt)
  * [gte()](#gte)
  * [guard()](#guard)
  * [infinity()](#infinity)
  * [integer()](#integer)
  * [less()](#less)
  * [lessOrEquals()](#lessorequals)
  * [lessThan()](#lessthan)
  * [lessThanOrEquals()](#lessthanorequals)
  * [lt()](#lt)
  * [lte()](#lte)
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
  * [plainObject()](#plainobject)
  * [positive()](#positive)
  * [regex()](#regex)
  * [result()](#result)
  * [string()](#string)
  * [symbol()](#symbol)
  * [truthy()](#truthy)
  * [type()](#type)
  * [typeDetail()](#typedetail)
  * [undefined()](#undefined)

## Constructors

### Constructor

> **new Checker**(`value`, `name`): `Checker`

Creates a new TypeChecker object instance

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
| <a id="checks"></a> `checks` | [`CheckDetail`](/docs/servicenow/check/interfaces/CheckDetail.md)\[] | array of objects detailing each check that was performed |
| <a id="errors"></a> `errors` | `string`\[] | array of objects detailing validation errors |
| <a id="invert"></a> `invert` | `boolean` | controls if the result should be inverted, used when "not" is included in the call chain |
| <a id="name"></a> `name` | `string` | name or label of the current value being processed |
| <a id="typeof"></a> `typeof` | `string` | type of the current value |
| <a id="typeofdetail"></a> `typeofDetail` | `string` | detailed typeof the current value |
| <a id="value"></a> `value` | `any` | the current value being processed |

## Accessors

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

### prefix

#### Get Signature

> **get** **prefix**(): `string`

Returns the prefix to be used for crafting user-readable strings

##### Returns

`string`

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

#### Returns

`Checker`

***

### bigint()

> **bigint**(): `Checker`

#### Returns

`Checker`

***

### boolean()

> **boolean**(): `Checker`

#### Returns

`Checker`

***

### check()

> **check**(`value`, `name`): `Checker`

used to append additional checks to an existing TypeChecker

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `any` | the value to be checked |
| `name` | `string` | name or label of the value being checked |

#### Returns

`Checker`

the current TypeChecker instance

***

### date()

> **date**(): `Checker`

#### Returns

`Checker`

***

### equal()

> **equal**(`expected`): `Checker`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `expected` | `any` |

#### Returns

`Checker`

***

### equals()

> **equals**(`expected`): `Checker`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `expected` | `any` |

#### Returns

`Checker`

***

### evaluate()

> **evaluate**(`pass`, `detail`): `Checker`

evaluates a Type.check() call chain, finalizes pass/fail,
records full check details, and logs/throws errors,
and resets the inversion flag for the next check

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pass` | `any` |
| `detail` | `any` |

#### Returns

`Checker`

***

### falsy()

> **falsy**(): `Checker`

#### Returns

`Checker`

***

### finite()

> **finite**(): `Checker`

#### Returns

`Checker`

***

### float()

> **float**(): `Checker`

#### Returns

`Checker`

***

### function()

> **function**(): `Checker`

#### Returns

`Checker`

***

### greater()

> **greater**(`expected`): `Checker`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `expected` | `any` |

#### Returns

`Checker`

***

### greaterOrEquals()

> **greaterOrEquals**(`expected`): `Checker`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `expected` | `any` |

#### Returns

`Checker`

***

### greaterThan()

> **greaterThan**(`expected`): `Checker`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `expected` | `any` |

#### Returns

`Checker`

***

### greaterThanOrEquals()

> **greaterThanOrEquals**(`expected`): `Checker`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `expected` | `any` |

#### Returns

`Checker`

***

### gt()

> **gt**(`expected`): `Checker`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `expected` | `any` |

#### Returns

`Checker`

***

### gte()

> **gte**(`expected`): `any`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `expected` | `any` |

#### Returns

`any`

***

### guard()

> **guard**(): `Checker`

checks the current validation status and throws a TypeError if not ok

#### Returns

`Checker`

the current TypeChecker instance

***

### infinity()

> **infinity**(): `Checker`

#### Returns

`Checker`

***

### integer()

> **integer**(): `Checker`

#### Returns

`Checker`

***

### less()

> **less**(`expected`): `Checker`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `expected` | `any` |

#### Returns

`Checker`

***

### lessOrEquals()

> **lessOrEquals**(`expected`): `Checker`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `expected` | `any` |

#### Returns

`Checker`

***

### lessThan()

> **lessThan**(`expected`): `Checker`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `expected` | `any` |

#### Returns

`Checker`

***

### lessThanOrEquals()

> **lessThanOrEquals**(): `Checker`

#### Returns

`Checker`

***

### lt()

> **lt**(`expected`): `Checker`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `expected` | `any` |

#### Returns

`Checker`

***

### lte()

> **lte**(`expected`): `Checker`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `expected` | `any` |

#### Returns

`Checker`

***

### multipleOf()

> **multipleOf**(`v`): `void`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `any` |

#### Returns

`void`

***

### nan()

> **nan**(): `Checker`

#### Returns

`Checker`

***

### negative()

> **negative**(): `Checker`

#### Returns

`Checker`

***

### nil()

> **nil**(): `Checker`

#### Returns

`Checker`

***

### noneOf()

> **noneOf**(`array`): `Checker`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `array` | `any` |

#### Returns

`Checker`

***

### null()

> **null**(): `Checker`

#### Returns

`Checker`

***

### number()

> **number**(): `Checker`

#### Returns

`Checker`

***

### object()

> **object**(): `Checker`

#### Returns

`Checker`

***

### ok()

> **ok**(): `boolean`

#### Returns

`boolean`

returns true if there were no type errors

***

### oneOf()

> **oneOf**(`array`): `Checker`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `array` | `any` |

#### Returns

`Checker`

***

### plainObject()

> **plainObject**(): `Checker`

#### Returns

`Checker`

***

### positive()

> **positive**(): `Checker`

#### Returns

`Checker`

***

### regex()

> **regex**(): `Checker`

#### Returns

`Checker`

***

### result()

> **result**(): `any`

returns the type validation result

#### Returns

`any`

result summary

***

### string()

> **string**(): `Checker`

#### Returns

`Checker`

***

### symbol()

> **symbol**(): `Checker`

#### Returns

`Checker`

***

### truthy()

> **truthy**(): `Checker`

#### Returns

`Checker`

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
let pass = Check({ testValue }).is.type('string'); // true
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

#### Returns

`Checker`
