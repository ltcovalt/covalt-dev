[Check](../README.md) / Checker

# Class: Checker

Fluent validation builder for composing multiple validation checks,
handling errors, and returning structured results.

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
  * [blank()](#blank)
  * [boolean()](#boolean)
  * [check()](#check)
  * [contains()](#contains)
  * [date()](#date)
  * [empty()](#empty)
  * [endsWith()](#endswith)
  * [equal()](#equal)
  * [equals()](#equals)
  * [false()](#false)
  * [falsy()](#falsy)
  * [finite()](#finite)
  * [float()](#float)
  * [formatError()](#formaterror)
  * [function()](#function)
  * [glideDate()](#glidedate)
  * [glideDateTime()](#glidedatetime)
  * [glideDuration()](#glideduration)
  * [glideSchedule()](#glideschedule)
  * [glideSession()](#glidesession)
  * [glideUser()](#glideuser)
  * [greater()](#greater)
  * [greaterOrEqual()](#greaterorequal)
  * [greaterThan()](#greaterthan)
  * [greaterThanOrEqual()](#greaterthanorequal)
  * [gt()](#gt)
  * [gte()](#gte)
  * [guard()](#guard)
  * [hasProperty()](#hasproperty)
  * [includes()](#includes)
  * [infinity()](#infinity)
  * [instanceOf()](#instanceof)
  * [integer()](#integer)
  * [length()](#length)
  * [lengthBetween()](#lengthbetween)
  * [less()](#less)
  * [lessOrEqual()](#lessorequal)
  * [lessThan()](#lessthan)
  * [lessThanOrEqual()](#lessthanorequal)
  * [lt()](#lt)
  * [lte()](#lte)
  * [match()](#match)
  * [matches()](#matches)
  * [maxLength()](#maxlength)
  * [message()](#message)
  * [minLength()](#minlength)
  * [msg()](#msg)
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
  * [property()](#property)
  * [regex()](#regex)
  * [required()](#required)
  * [result()](#result)
  * [run()](#run)
  * [satisfies()](#satisfies)
  * [startsWith()](#startswith)
  * [string()](#string)
  * [symbol()](#symbol)
  * [true()](#true)
  * [truthy()](#truthy)
  * [type()](#type)
  * [typeDetail()](#typedetail)
  * [undefined()](#undefined)
  * [validRecord()](#validrecord)
  * [validTable()](#validtable)

## Constructors

### Constructor

> **new Checker**(`value`, `name?`): `Checker`

Creates a new Checker object instance

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `any` | the value to be checked |
| `name?` | `string` | the name or label of the value being checked |

#### Returns

`Checker`

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="abort"></a> `abort` | `boolean` | - |
| <a id="checkcount"></a> `checkCount` | `number` | - |
| <a id="checks"></a> `checks` | [`CheckDetail`](../interfaces/CheckDetail.md)\[] | array of objects detailing each check that was performed |
| <a id="errors"></a> `errors` | `string`\[] | array of strings detailing validation errors |
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

##### Example

```ts
Check('hello', 'val').is.a.string().ok(); // true
```

##### Returns

`this`

***

### an

#### Get Signature

> **get** **an**(): `this`

No-op helper used solely to make fluent chaining more readable

##### Example

```ts
Check([], 'val').is.an.array().ok(); // true
```

##### Returns

`this`

***

### and

#### Get Signature

> **get** **and**(): `this`

No-op helper used solely to make fluent chaining more readable

##### Example

```ts
Check(5, 'num').is.greaterThan(3).and.lessThan(10).ok(); // true
```

##### Returns

`this`

***

### are

#### Get Signature

> **get** **are**(): `this`

No-op helper used solely to make fluent chaining more readable

##### Example

```ts
Check([1, 2, 3], 'values').are.array().ok(); // true
```

##### Returns

`this`

***

### be

#### Get Signature

> **get** **be**(): `this`

No-op helper used solely to make fluent chaining more readable

##### Example

```ts
Check(5, 'num').to.be.positive().ok(); // true
```

##### Returns

`this`

***

### has

#### Get Signature

> **get** **has**(): `this`

No-op helper used solely to make fluent chaining more readable

##### Example

```ts
Check('hello', 'val').has.length(5).ok(); // true
```

##### Returns

`this`

***

### have

#### Get Signature

> **get** **have**(): `this`

No-op helper used solely to make fluent chaining more readable

##### Example

```ts
Check('hello', 'val').to.have.length(5).ok(); // true
```

##### Returns

`this`

***

### is

#### Get Signature

> **get** **is**(): `this`

No-op helper used solely to make fluent chaining more readable

##### Example

```ts
Check(5, 'num').is.positive().ok(); // true
```

##### Returns

`this`

***

### not

#### Get Signature

> **get** **not**(): `this`

Inverts the result when the next set of validations is evaluated

##### Example

```ts
Check(3, 'num').not.equal(5).ok(); // true
Check('hello', 'val').not.string().ok(); // false
```

##### Returns

`this`

***

### to

#### Get Signature

> **get** **to**(): `this`

No-op helper used solely to make fluent chaining more readable

##### Example

```ts
Check(5, 'num').to.be.positive().ok(); // true
```

##### Returns

`this`

## Methods

### array()

> **array**(): `Checker`

Checks if a value is an Array

#### Returns

`Checker`

#### Example

```ts
Check([1, 2, 3], 'val').is.array().ok(); // true
Check({}, 'val').is.array().ok(); // false
```

***

### between()

> **between**(`min`, `max`): `Checker`

Checks if a value is between or equal to a min and max value

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `min` | `number` | the minimum value |
| `max` | `number` | the maximum value |

#### Returns

`Checker`

#### Example

```ts
Check(3, 'Positive').is.between(0, 5).ok(); // true
Check(-3, 'Negative').is.between(0, 5).ok(); // false
Check(0, 'Zero').is.between(0, 5).ok(); // true
```

***

### bigint()

> **bigint**(): `Checker`

Checks if a value is a bigint

#### Returns

`Checker`

#### Example

```ts
Check(10n, 'val').is.bigint().ok(); // true
Check(10, 'val').is.bigint().ok(); // false
```

***

### blank()

> **blank**(): `Checker`

Checks if the current value is empty.
Alias for [empty](#empty).

#### Returns

`Checker`

#### Example

```ts
Check('', 'val').is.blank().ok(); // true
```

***

### boolean()

> **boolean**(): `Checker`

Checks if a value is a boolean

#### Returns

`Checker`

#### Example

```ts
Check(true, 'val').is.boolean().ok(); // true
Check(0, 'val').is.boolean().ok(); // false
```

***

### check()

> **check**(`value`, `name?`): `Checker`

Used to append additional checks to an existing Checker

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `any` | the value to be checked |
| `name?` | `string` | name or label of the value being checked |

#### Returns

`Checker`

the current Checker instance

#### Example

```ts
let checker = Check(5, 'num').is.positive();
checker.check('hello', 'str').is.string();
checker.ok(); // true (both checks passed)
```

***

### contains()

> **contains**(`element`): `Checker`

Checks if the current value includes the expected substring (for strings) or element (for arrays).
Alias for [includes](#includes).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `element` | `any` | the substring or array element to search for |

#### Returns

`Checker`

#### Example

```ts
Check('hello world', 'val').contains('world').ok(); // true
Check([1, 2, 3], 'val').contains(2).ok(); // true
```

***

### date()

> **date**(): `Checker`

Checks if a value is a Date object.
Note that this is will only return true for a standard `Date` object instance.
It does not check if a value is a `GlideDate` or `GlideDateTime` instance

#### Returns

`Checker`

#### Example

```ts
Check(new Date(), 'val').is.date().ok(); // true
Check('2026-06-25', 'val').is.date().ok(); // false
```

***

### empty()

> **empty**(): `Checker`

Checks if the current value is empty.
A value is empty if it is nil (null/undefined), an empty string, an empty array,
or an object with no enumerable properties.

#### Returns

`Checker`

#### Example

```ts
Check('', 'val').is.empty().ok(); // true
Check([], 'val').is.empty().ok(); // true
Check('hello', 'val').not.empty().ok(); // true
```

***

### endsWith()

> **endsWith**(`suffix`): `Checker`

Checks if the current value ends with the expected suffix.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `suffix` | `string` | the suffix to check |

#### Returns

`Checker`

#### Example

```ts
Check('hello world', 'val').is.endsWith('world').ok(); // true
```

***

### equal()

> **equal**(`expected`): `Checker`

Performs a strict equality (===) check on a value

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `expected` | `any` | the expected value |

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

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `expected` | `any` | the expected value |

#### Returns

`Checker`

#### Example

```ts
Check(1, 'number').equals(1).ok(); // true
Check('1', 'number').equals(1).ok(); // false
```

***

### false()

> **false**(): `Checker`

Checks if the current value is strictly false.

#### Returns

`Checker`

#### Example

```ts
Check(false, 'val').is.false().ok(); // true
Check(0, 'val').is.false().ok(); // false
```

***

### falsy()

> **falsy**(): `Checker`

Coerces a value to a boolean and checks if it is a falsy value

#### Returns

`Checker`

#### Example

```ts
Check('string', 'val').is.falsy().ok(); // false
Check(true, 'val').is.falsy().ok(); // false
Check({}, 'val').is.falsy().ok(); // false
Check(0, 'val').is.falsy().ok(); // true
Check('', 'val').is.falsy().ok(); // true
Check(NaN, 'val').is.falsy().ok(); // true
Check(null, 'val').is.falsy().ok(); // true
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

#### Example

```ts
Check(12.3, 'val').is.float().ok(); // true
Check(123, 'val').is.float().ok(); // false
```

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

#### Example

```ts
Check(() => {}, 'val').is.function().ok(); // true
Check({}, 'val').is.function().ok(); // false
```

***

### glideDate()

> **glideDate**(): `Checker`

Checks if the current value is a GlideDate instance.

#### Returns

`Checker`

#### Example

```ts
Check(new GlideDate(), 'date').is.glideDate().ok(); // true
```

***

### glideDateTime()

> **glideDateTime**(): `Checker`

Checks if the current value is a GlideDateTime instance.

#### Returns

`Checker`

#### Example

```ts
Check(new GlideDateTime(), 'dateTime').is.glideDateTime().ok(); // true
```

***

### glideDuration()

> **glideDuration**(): `Checker`

Checks if the current value is a GlideDuration instance.

#### Returns

`Checker`

#### Example

```ts
Check(new GlideDuration(), 'duration').is.glideDuration().ok(); // true
```

***

### glideSchedule()

> **glideSchedule**(): `Checker`

Checks if the current value is a GlideSchedule instance.

#### Returns

`Checker`

#### Example

```ts
Check(new GlideSchedule(), 'schedule').is.glideSchedule().ok(); // true
```

***

### glideSession()

> **glideSession**(): `Checker`

Checks if the current value is a GlideSession instance.

#### Returns

`Checker`

#### Example

```ts
Check(gs.getSession(), 'session').is.glideSession().ok(); // true
```

***

### glideUser()

> **glideUser**(): `Checker`

Checks if the current value is a GlideUser instance.

#### Returns

`Checker`

#### Example

```ts
Check(gs.getUser(), 'user').is.glideUser().ok(); // true
```

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

#### Example

```ts
Check(5, 'val').greater(3).ok(); // true
```

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

#### Example

```ts
Check(5, 'val').greaterOrEqual(5).ok(); // true
```

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

#### Example

```ts
Check(5, 'val').is.greaterThan(3).ok(); // true
Check(3, 'val').is.greaterThan(3).ok(); // false
```

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

#### Example

```ts
Check(5, 'val').is.greaterThanOrEqual(5).ok(); // true
Check(4, 'val').is.greaterThanOrEqual(5).ok(); // false
```

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

#### Example

```ts
Check(5, 'val').gt(3).ok(); // true
```

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

#### Example

```ts
Check(5, 'val').gte(5).ok(); // true
```

***

### guard()

> **guard**(): `Checker`

Checks the current validation status and throws a TypeError if not ok

#### Returns

`Checker`

the current Checker instance

#### Throws

if any validation checks failed

#### Example

```ts
Check('hello', 'val').is.number().guard(); // throws TypeError
```

***

### hasProperty()

> **hasProperty**(`key`): `Checker`

Checks if the current value is an object and contains the specified property key.
Alias for [property](#property).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | `symbol` | the property key to check for |

#### Returns

`Checker`

#### Example

```ts
Check({ id: 123 }, 'val').hasProperty('id').ok(); // true
```

***

### includes()

> **includes**(`element`): `Checker`

Checks if the current value includes the expected substring (for strings) or element (for arrays).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `element` | `any` | the substring or array element to search for |

#### Returns

`Checker`

#### Example

```ts
Check('hello world', 'val').is.includes('world').ok(); // true
Check([1, 2, 3], 'val').is.includes(2).ok(); // true
```

***

### infinity()

> **infinity**(): `Checker`

Checks if a value is Infinity

#### Returns

`Checker`

#### Example

```ts
Check(Infinity, 'val').is.infinity().ok(); // true
Check(123, 'val').is.infinity().ok(); // false
```

***

### instanceOf()

> **instanceOf**(`constructor`): `Checker`

Checks if the current value is an instance of the specified constructor/class.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `constructor` | `Function` | the constructor function or class to check against |

#### Returns

`Checker`

#### Example

```ts
class MyClass {}
let obj = new MyClass();
Check(obj, 'instance').is.instanceOf(MyClass).ok(); // true
```

***

### integer()

> **integer**(): `Checker`

Checks if a value is an integer

#### Returns

`Checker`

#### Example

```ts
Check(123, 'val').is.integer().ok(); // true
Check(12.3, 'val').is.integer().ok(); // false
```

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

#### Example

```ts
Check([1, 2, 3], 'val').is.length(3).ok(); // true
Check('hello', 'val').is.length(5).ok(); // true
```

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

#### Example

```ts
Check([1, 2, 3], 'val').is.lengthBetween(1, 5).ok(); // true
Check('hello', 'val').is.lengthBetween(6, 10).ok(); // false
```

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

#### Example

```ts
Check(3, 'val').less(5).ok(); // true
```

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

#### Example

```ts
Check(5, 'val').lessOrEqual(5).ok(); // true
```

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

#### Example

```ts
Check(3, 'val').is.lessThan(5).ok(); // true
Check(5, 'val').is.lessThan(5).ok(); // false
```

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

#### Example

```ts
Check(5, 'val').is.lessThanOrEqual(5).ok(); // true
Check(6, 'val').is.lessThanOrEqual(5).ok(); // false
```

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

#### Example

```ts
Check(3, 'val').lt(5).ok(); // true
```

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

#### Example

```ts
Check(5, 'val').lte(5).ok(); // true
```

***

### match()

> **match**(`regex`): `Checker`

Checks if the current value matches a regular expression pattern.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `regex` | `RegExp` | the regular expression to test against |

#### Returns

`Checker`

#### Example

```ts
Check('hello', 'val').is.match(/^h/).ok(); // true
```

***

### matches()

> **matches**(`regex`): `Checker`

Checks if the current value matches a regular expression pattern.
Alias for [match](#match).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `regex` | `RegExp` | the regular expression to test against |

#### Returns

`Checker`

#### Example

```ts
Check('hello', 'val').matches(/^h/).ok(); // true
```

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

#### Example

```ts
Check([1, 2, 3], 'val').is.maxLength(5).ok(); // true
Check('hello world', 'val').is.maxLength(5).ok(); // false
```

***

### message()

> **message**(`msg`): `Checker`

Overrides the error message for the most recently evaluated check in the chain.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `msg` | `string` | (`arg0`) => `string` | custom error message string or function |

#### Returns

`Checker`

#### Example

```ts
Check(password).is.minLength(8).message('Password is too short.').guard();
```

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

#### Example

```ts
Check([1, 2, 3], 'val').is.minLength(2).ok(); // true
Check('a', 'val').is.minLength(2).ok(); // false
```

***

### msg()

> **msg**(`msg`): `Checker`

Overrides the error message for the most recently evaluated check in the chain.
Alias for [message](#message).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `msg` | `string` | (`arg0`) => `string` | custom error message string or function |

#### Returns

`Checker`

#### Example

```ts
Check(password).is.minLength(8).msg('Password is too short.').guard();
```

***

### multipleOf()

> **multipleOf**(`expected`): `Checker`

Checks if a value is a multiple of the expected value.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `expected` | `number` | number the value should be a multiple of |

#### Returns

`Checker`

#### Example

```ts
Check(10, 'val').is.multipleOf(5).ok(); // true
Check(12, 'val').is.multipleOf(5).ok(); // false
```

***

### nan()

> **nan**(): `Checker`

Checks if a value is Not-a-Number (NaN)

#### Returns

`Checker`

#### Example

```ts
Check(NaN, 'val').is.nan().ok(); // true
Check(123, 'val').is.nan().ok(); // false
```

***

### negative()

> **negative**(): `Checker`

Checks if a value is a negative number

#### Returns

`Checker`

#### Example

```ts
Check(3, 'Positive').is.negative().ok(); // false
Check(-3, 'Negative').is.negative().ok(); // true
Check(0, 'Zero').is.negative().ok(); // false
```

***

### nil()

> **nil**(): `Checker`

Checks if a value is null or undefined

#### Returns

`Checker`

#### Example

```ts
Check(null, 'val').is.nil().ok(); // true
Check(undefined, 'val').is.nil().ok(); // true
Check(0, 'val').is.nil().ok(); // false
```

***

### noneOf()

> **noneOf**(`array`): `Checker`

Checks if a value is not present in an array of values

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `array` | `any`\[] | array of values |

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

#### Example

```ts
Check(null, 'val').is.null().ok(); // true
Check(undefined, 'val').is.null().ok(); // false
```

***

### number()

> **number**(): `Checker`

Checks if a value is a number

#### Returns

`Checker`

#### Example

```ts
Check(123, 'val').is.number().ok(); // true
Check('123', 'val').is.number().ok(); // false
```

***

### object()

> **object**(): `Checker`

Checks if a value is an object

#### Returns

`Checker`

#### Example

```ts
Check({}, 'val').is.object().ok(); // true
Check(null, 'val').is.object().ok(); // true (typeof null is 'object')
```

***

### ok()

> **ok**(): `boolean`

Checks the entire validation chain for errors

#### Returns

`boolean`

true if there were no validation errors

#### Example

```ts
let pass = Check(10, 'num').is.number().ok(); // true
```

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

#### Example

```ts
Check(null, 'val').opt().string().ok(); // true
```

***

### optional()

> **optional**(): `Checker`

Sets the current value being checked as optional.
If invoked as `not.optional()`, delegates to [required()](#required).

#### Returns

`Checker`

#### Example

```ts
Check(null, 'val').optional().string().ok(); // true (aborts/skips subsequent checks when nil)
Check('hello', 'val').optional().string().ok(); // true (performs checks when not nil)
Check(123, 'val').optional().string().ok(); // false (fails checks when not nil and not string)
```

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
Check(3, 'Positive').is.positive().ok(); // true
Check(-3, 'Negative').is.positive().ok(); // false
Check(0, 'Zero').is.positive().ok(); // false
```

***

### property()

> **property**(`key`): `Checker`

Checks if the current value is an object and contains the specified property key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | `symbol` | the property key to check for |

#### Returns

`Checker`

#### Example

```ts
Check({ id: 123 }, 'val').has.property('id').ok(); // true
Check({}, 'val').has.property('id').ok(); // false
```

***

### regex()

> **regex**(): `Checker`

Checks if a value is a Regular Expression

#### Returns

`Checker`

#### Example

```ts
Check(/abc/, 'val').is.regex().ok(); // true
Check('abc', 'val').is.regex().ok(); // false
```

***

### required()

> **required**(): `Checker`

Sets the current value being checked as required.
If invoked as not.required(), delegates to [optional()](#optional).

#### Returns

`Checker`

#### Example

```ts
Check('hello', 'val').required().ok(); // true
Check(null, 'val').required().ok(); // false
```

***

### result()

> **result**(): `object`

Returns the validation result summary

#### Returns

`object`

result summary containing ok status, list of checks, and errors

| Name | Type |
| ------ | ------ |
| `checks` | [`CheckDetail`](../interfaces/CheckDetail.md)\[] |
| `errors` | `string`\[] |
| `ok` | `boolean` |

#### Example

```ts
let res = Check('hello', 'val').is.string().result();
// res.ok -> true
```

***

### run()

> **run**(`detail`, `predicate`): `Checker`

Evaluates a validation predicate, finalizes pass/fail status,
records check details, appends errors if failed, and resets the inversion flag.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `detail` | `Partial`<[`CheckDetail`](../interfaces/CheckDetail.md)> | object containing details on the current check |
| `predicate` | () => `boolean` | callback function that must return a boolean indicating if the check passed |

#### Returns

`Checker`

the current Checker instance

***

### satisfies()

> **satisfies**(`predicateFn`, `expectedDescription?`): `Checker`

Asserts that the current value satisfies a custom predicate function.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `predicateFn` | (`arg0`) => `boolean` | function that takes the current value and returns a boolean |
| `expectedDescription?` | `string` | description of the custom check for error messaging |

#### Returns

`Checker`

#### Example

```ts
Check(4, 'num').is.satisfies((val) => val % 2 === 0, 'an even number').ok(); // true
```

***

### startsWith()

> **startsWith**(`prefix`): `Checker`

Checks if the current value starts with the expected prefix.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prefix` | `string` | the prefix to check |

#### Returns

`Checker`

#### Example

```ts
Check('hello world', 'val').is.startsWith('hello').ok(); // true
```

***

### string()

> **string**(): `Checker`

Checks if a value is a string

#### Returns

`Checker`

#### Example

```ts
Check('hello', 'val').is.string().ok(); // true
Check(123, 'val').is.string().ok(); // false
```

***

### symbol()

> **symbol**(): `Checker`

Checks if a value is a symbol

#### Returns

`Checker`

#### Example

```ts
Check(Symbol('foo'), 'val').is.symbol().ok(); // true
Check('foo', 'val').is.symbol().ok(); // false
```

***

### true()

> **true**(): `Checker`

Checks if the current value is strictly true.

#### Returns

`Checker`

#### Example

```ts
Check(true, 'val').is.true().ok(); // true
Check('true', 'val').is.true().ok(); // false
```

***

### truthy()

> **truthy**(): `Checker`

Coerces a value to a boolean and checks if it is a truthy value

#### Returns

`Checker`

#### Example

```ts
Check('string', 'val').is.truthy().ok(); // true
Check(true, 'val').is.truthy().ok(); // true
Check({}, 'val').is.truthy().ok(); // true
Check(0, 'val').is.truthy().ok(); // false
Check(null, 'val').is.truthy().ok(); // false
```

***

### type()

> **type**(`expected`): `Checker`

Checks if the current value is the expected type

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `expected` | `string` | the expected type (e.g., 'string', 'number', 'boolean', 'object', 'undefined', 'function', 'symbol', 'bigint') |

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

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `expected` | `string` | the expected detailed type |

#### Returns

`Checker`

#### Examples

```ts
let testValue = new GlideRecord('sys_user');
let pass = Check({ testValue }).is.typeDetail('object (GlideRecord)').ok(); // true
```

```ts
let testValue = {};
let pass = Check({ testValue }).is.typeDetail('object (Object)').ok(); // true
```

***

### undefined()

> **undefined**(): `Checker`

Checks if a value is undefined

#### Returns

`Checker`

#### Example

```ts
Check(undefined, 'val').is.undefined().ok(); // true
Check(null, 'val').is.undefined().ok(); // false
```

***

### validRecord()

> **validRecord**(): `Checker`

Checks if the current value is a valid GlideRecord or GlideRecordSecure instance.

#### Returns

`Checker`

#### Example

```ts
let gr = new GlideRecord('sys_user');
Check(gr, 'val').is.validRecord().ok(); // true
```

***

### validTable()

> **validTable**(): `Checker`

Checks if the current value is a valid ServiceNow table name.

#### Returns

`Checker`

#### Example

```ts
Check('sys_user', 'val').is.validTable().ok(); // true
```
