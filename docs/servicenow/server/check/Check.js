/**
 * @typedef {Object} CheckDetail - details the results of each predicate check performed
 * @property {string} name - the name or label of the value being checked
 * @property {boolean} pass - true if the check was passed
 * @property {'pass'|'fail'|'skip'|'error'} status - status of a predicate evaluation
 * @property {string} [message] - additional information about the status
 * @property {boolean} invert - true if the check result should be inverted
 * @property {boolean} abort - set to true when a predicate fails, skipping remaining predicates for the current check
 * @property {any} actual - the actual value received
 * @property {string} predicate - name of the predicate function that was ran
 * @property {any} expected - the expected value
 * @property {boolean} exception - true if the predicate threw an exception
 */

/**
 * Factory function for the Checker class.
 * If a name is not provided, it accepts an object containing a single name-value pair
 * to extract and use as both the name and the value for the Checker instance.
 * @param {*} value - the value to be checked (or a single key-value object if name is omitted)
 * @param {string} [name] - the name or label of the value being checked
 * @returns {Checker} a new Checker instance
 *
 * @example
 * let pass = Check('hello', 'val').is.string().ok(); // true
 *
 * @example
 * let testValue = 'hello';
 * let pass = Check({ testValue }).is.string().ok(); // true
 */
const Check = (value, name) => {
	// if a name isn't provided, accept an object with a single name:value pair
	// to use as the name and value for the Checker instance
	if (!name && value && Type.isPlainObject(value)) {
		let keys = Object.keys(value);
		if (keys.length === 1) {
			return new Checker(value[keys[0]], keys[0]);
		}
	}
	return new Checker(value, name);
};

/**
 * Fluent validation builder for composing multiple validation checks,
 * handling errors, and returning structured results.
 *
 * @property {any} value - the current value being processed
 * @property {string} name - name or label of the current value being processed
 * @property {string} typeof - type of the current value
 * @property {string} typeofDetail - detailed typeof the current value
 * @property {boolean} invert - controls if the result should be inverted, used when "not" is included in the call chain
 * @property {CheckDetail[]} checks - array of objects detailing each check that was performed
 * @property {string[]} errors - array of strings detailing validation errors
 */
class Checker {
	/**
	 * Creates a new Checker object instance
	 * @param {*} value - the value to be checked
	 * @param {string} [name] - the name or label of the value being checked
	 */
	constructor(value, name) {
		/** @type {number} */
		this.checkCount = 1;
		/** @type {any} */
		this.value = value;
		/** @type {string} */
		this.name = name ?? `value #${this.checkCount}`;
		/** @type {string} */
		this.typeof = typeof this.value;
		/** @type {string} */
		this.typeofDetail = Type.detail(this.value);
		/** @type {boolean} */
		this.invert = false;
		/** @type {CheckDetail[]} */
		this.checks = [];
		/** @type {string[]} */
		this.errors = [];

		/** @type {boolean} */
		this.abort = false;
	}

	// NOTE: modifier properties

	/**
	 * Inverts the result when the next set of validations is evaluated
	 * @returns {this}
	 *
	 * @example
	 * Check(3, 'num').not.equal(5).ok(); // true
	 * Check('hello', 'val').not.string().ok(); // false
	 */
	get not() {
		this.invert = !this.invert;
		return this;
	}

	// TODO: no-op passthrough getters to make API calls grammically accurate
	// consider limiting which predicates are available for each getter

	/**
	 * No-op helper used solely to make fluent chaining more readable
	 * @returns {this}
	 *
	 * @example
	 * Check('hello', 'val').is.a.string().ok(); // true
	 */
	get a() {
		return this;
	}

	/**
	 * No-op helper used solely to make fluent chaining more readable
	 * @returns {this}
	 *
	 * @example
	 * Check([], 'val').is.an.array().ok(); // true
	 */
	get an() {
		return this;
	}

	/**
	 * No-op helper used solely to make fluent chaining more readable
	 * @returns {this}
	 *
	 * @example
	 * Check(5, 'num').is.greaterThan(3).and.lessThan(10).ok(); // true
	 */
	get and() {
		return this;
	}

	/**
	 * No-op helper used solely to make fluent chaining more readable
	 * @returns {this}
	 *
	 * @example
	 * Check([1, 2, 3], 'values').are.array().ok(); // true
	 */
	get are() {
		return this;
	}

	/**
	 * No-op helper used solely to make fluent chaining more readable
	 * @returns {this}
	 *
	 * @example
	 * Check(5, 'num').to.be.positive().ok(); // true
	 */
	get be() {
		return this;
	}

	/**
	 * No-op helper used solely to make fluent chaining more readable
	 * @returns {this}
	 *
	 * @example
	 * Check('hello', 'val').has.length(5).ok(); // true
	 */
	get has() {
		return this;
	}

	/**
	 * No-op helper used solely to make fluent chaining more readable
	 * @returns {this}
	 *
	 * @example
	 * Check(5, 'num').is.positive().ok(); // true
	 */
	get is() {
		return this;
	}

	/**
	 * No-op helper used solely to make fluent chaining more readable
	 * @returns {this}
	 *
	 * @example
	 * Check(5, 'num').to.be.positive().ok(); // true
	 */
	get to() {
		return this;
	}

	/**
	 * No-op helper used solely to make fluent chaining more readable
	 * @returns {this}
	 *
	 * @example
	 * Check('hello', 'val').to.have.length(5).ok(); // true
	 */
	get have() {
		return this;
	}

	// NOTE: behavior modifiers

	/**
	 * Sets the current value being checked as required.
	 * If invoked as not.required(), delegates to [optional()](#optional).
	 * @returns {this}
	 *
	 * @example
	 * Check('hello', 'val').required().ok(); // true
	 * Check(null, 'val').required().ok(); // false
	 */
	required() {
		if (this.invert) {
			this.invert = false;
			return this.optional();
		}

		return this.run(
			{
				actual: this.value,
				predicate: 'required',
				expected: 'value must not be nil',
				message: (d) => `expected a required value, received ${d.actual}`,
			},
			() => !Type.isNil(this.value),
		);
	}

	/**
	 * Sets the current value being checked as optional.
	 * If invoked as `not.optional()`, delegates to [required()](#required).
	 * @returns {this}
	 *
	 * @example
	 * Check(null, 'val').optional().string().ok(); // true (aborts/skips subsequent checks when nil)
	 * Check('hello', 'val').optional().string().ok(); // true (performs checks when not nil)
	 * Check(123, 'val').optional().string().ok(); // false (fails checks when not nil and not string)
	 */
	optional() {
		if (this.invert) {
			this.invert = false;
			return this.required();
		}

		let detail = {
			actual: this.value,
			predicate: 'optional',
			expected: 'value may be nil',
		};

		return this.run(detail, () => {
			if (Type.isNil(this.value)) {
				this.abort = true;
				detail.status = 'skip';
				return true;
			}
			return true;
		});
	}

	/**
	 * Sets the current value being checked as optional.
	 * Alias for [optional](#optional)
	 * @returns {this}
	 *
	 * @example
	 * Check(null, 'val').opt().string().ok(); // true
	 */
	opt() {
		return this.optional();
	}

	// NOTE: core type predicates

	/**
	 * Checks if the current value is the expected type
	 * @param {string} expected - the expected type (e.g., 'string', 'number', 'boolean', 'object', 'undefined', 'function', 'symbol', 'bigint')
	 * @returns {this}
	 *
	 * @example
	 * let testValue = 'Some String';
	 * let pass = Check({ testValue }).is.type('string').ok(); // true
	 */
	type(expected) {
		return this.run(
			{
				actual: this.typeof,
				predicate: 'type',
				expected,
				message: (d) => `expected type to ${d.invert ? 'NOT ' : ''}be ${d.expected}, received ${d.actual}`,
			},
			() => this.typeof === expected,
		);
	}

	/**
	 * Checks if the detailed type of the current value is the expected type
	 * @param {string} expected - the expected detailed type
	 * @returns {this}
	 *
	 * @example
	 * let testValue = new GlideRecord('sys_user');
	 * let pass = Check({ testValue }).is.typeDetail('object (GlideRecord)').ok(); // true
	 *
	 * @example
	 * let testValue = {};
	 * let pass = Check({ testValue }).is.typeDetail('object (Object)').ok(); // true
	 */
	typeDetail(expected) {
		return this.run(
			{
				actual: this.typeofDetail,
				predicate: 'typeDetail',
				expected,
				message: (d) => `expected detailed type to ${d.invert ? 'NOT ' : ''}be ${d.expected}, received ${d.actual}`,
			},
			() => this.typeofDetail === expected,
		);
	}

	// NOTE: basic type checks

	/**
	 * Checks if a value is a string
	 * @returns {this}
	 *
	 * @example
	 * Check('hello', 'val').is.string().ok(); // true
	 * Check(123, 'val').is.string().ok(); // false
	 */
	string() {
		return this.type('string');
	}

	// NOTE: string content predicates

	/**
	 * Checks if the current value matches a regular expression pattern.
	 * @param {RegExp} regex - the regular expression to test against
	 * @returns {this}
	 *
	 * @example
	 * Check('hello', 'val').is.match(/^h/).ok(); // true
	 */
	match(regex) {
		return this.run(
			{
				actual: this.value,
				predicate: 'match',
				expected: regex,
			},
			() => {
				if (typeof this.value !== 'string') return false;
				if (!(regex instanceof RegExp)) throw TypeError('match(regex) requires input to be a RegExp.');
				return regex.test(this.value);
			},
		);
	}

	/**
	 * Checks if the current value matches a regular expression pattern.
	 * Alias for [match](#match).
	 * @param {RegExp} regex - the regular expression to test against
	 * @returns {this}
	 *
	 * @example
	 * Check('hello', 'val').matches(/^h/).ok(); // true
	 */
	matches(regex) {
		return this.match(regex);
	}

	/**
	 * Checks if the current value includes the expected substring (for strings) or element (for arrays).
	 * @param {*} element - the substring or array element to search for
	 * @returns {this}
	 *
	 * @example
	 * Check('hello world', 'val').is.includes('world').ok(); // true
	 * Check([1, 2, 3], 'val').is.includes(2).ok(); // true
	 */
	includes(element) {
		return this.run(
			{
				actual: this.value,
				predicate: 'includes',
				expected: element,
				message: (d) => {
					const isArr = Array.isArray(d.actual);
					return `expected ${isArr ? 'array' : 'value'} to ${d.invert ? 'NOT ' : ''}include ${isArr ? 'element' : 'substring'} "${d.expected}", received ${d.actual}`;
				},
			},
			() => {
				if (typeof this.value === 'string') {
					return this.value.indexOf(element) !== -1;
				}
				if (Array.isArray(this.value)) {
					return this.value.indexOf(element) !== -1;
				}
				return false;
			},
		);
	}

	/**
	 * Checks if the current value includes the expected substring (for strings) or element (for arrays).
	 * Alias for [includes](#includes).
	 * @param {*} element - the substring or array element to search for
	 * @returns {this}
	 *
	 * @example
	 * Check('hello world', 'val').contains('world').ok(); // true
	 * Check([1, 2, 3], 'val').contains(2).ok(); // true
	 */
	contains(element) {
		return this.includes(element);
	}

	/**
	 * Checks if the current value starts with the expected prefix.
	 * @param {string} prefix - the prefix to check
	 * @returns {this}
	 *
	 * @example
	 * Check('hello world', 'val').is.startsWith('hello').ok(); // true
	 */
	startsWith(prefix) {
		return this.run(
			{
				actual: this.value,
				predicate: 'startsWith',
				expected: prefix,
			},
			() => {
				if (typeof this.value !== 'string') return false;
				return this.value.slice(0, prefix.length) === prefix;
			},
		);
	}

	/**
	 * Checks if the current value ends with the expected suffix.
	 * @param {string} suffix - the suffix to check
	 * @returns {this}
	 *
	 * @example
	 * Check('hello world', 'val').is.endsWith('world').ok(); // true
	 */
	endsWith(suffix) {
		return this.run(
			{
				actual: this.value,
				predicate: 'endsWith',
				expected: suffix,
			},
			() => {
				if (typeof this.value !== 'string') return false;
				return this.value.slice(-suffix.length) === suffix;
			},
		);
	}

	/**
	 * Checks if a value is a number
	 * @returns {this}
	 *
	 * @example
	 * Check(123, 'val').is.number().ok(); // true
	 * Check('123', 'val').is.number().ok(); // false
	 */
	number() {
		return this.type('number');
	}

	/**
	 * Checks if a value is a bigint
	 * @returns {this}
	 *
	 * @example
	 * Check(10n, 'val').is.bigint().ok(); // true
	 * Check(10, 'val').is.bigint().ok(); // false
	 */
	bigint() {
		return this.type('bigint');
	}

	/**
	 * Checks if a value is a boolean
	 * @returns {this}
	 *
	 * @example
	 * Check(true, 'val').is.boolean().ok(); // true
	 * Check(0, 'val').is.boolean().ok(); // false
	 */
	boolean() {
		return this.type('boolean');
	}

	/**
	 * Checks if a value is a function
	 * @returns {this}
	 *
	 * @example
	 * Check(() => {}, 'val').is.function().ok(); // true
	 * Check({}, 'val').is.function().ok(); // false
	 */
	function() {
		return this.type('function');
	}

	/**
	 * Checks if a value is an object
	 * @returns {this}
	 *
	 * @example
	 * Check({}, 'val').is.object().ok(); // true
	 * Check(null, 'val').is.object().ok(); // true (typeof null is 'object')
	 */
	object() {
		return this.type('object');
	}

	/**
	 * Checks if a value is null
	 * @returns {this}
	 *
	 * @example
	 * Check(null, 'val').is.null().ok(); // true
	 * Check(undefined, 'val').is.null().ok(); // false
	 */
	null() {
		return this.typeDetail('object (Null)');
	}

	/**
	 * Checks if a value is undefined
	 * @returns {this}
	 *
	 * @example
	 * Check(undefined, 'val').is.undefined().ok(); // true
	 * Check(null, 'val').is.undefined().ok(); // false
	 */
	undefined() {
		return this.type('undefined');
	}

	/**
	 * Checks if a value is null or undefined
	 * @returns {this}
	 *
	 * @example
	 * Check(null, 'val').is.nil().ok(); // true
	 * Check(undefined, 'val').is.nil().ok(); // true
	 * Check(0, 'val').is.nil().ok(); // false
	 */
	nil() {
		return this.run(
			{
				actual: this.typeof,
				predicate: 'nil',
				expected: 'null or undefined',
			},
			() => this.value === null || this.value === undefined,
		);
	}

	/**
	 * Checks if a value is a symbol
	 * @returns {this}
	 *
	 * @example
	 * Check(Symbol('foo'), 'val').is.symbol().ok(); // true
	 * Check('foo', 'val').is.symbol().ok(); // false
	 */
	symbol() {
		return this.type('symbol');
	}

	/**
	 * Checks if a value is an integer
	 * @returns {this}
	 *
	 * @example
	 * Check(123, 'val').is.integer().ok(); // true
	 * Check(12.3, 'val').is.integer().ok(); // false
	 */
	integer() {
		return this.typeDetail('number (Integer)');
	}

	/**
	 * Checks if a value is a float/decimal number
	 * @returns {this}
	 *
	 * @example
	 * Check(12.3, 'val').is.float().ok(); // true
	 * Check(123, 'val').is.float().ok(); // false
	 */
	float() {
		return this.typeDetail('number (Float)');
	}

	/**
	 * Checks if a value is Not-a-Number (NaN)
	 * @returns {this}
	 *
	 * @example
	 * Check(NaN, 'val').is.nan().ok(); // true
	 * Check(123, 'val').is.nan().ok(); // false
	 */
	nan() {
		return this.typeDetail('number (NaN)');
	}

	/**
	 * Checks if a value is Infinity
	 * @returns {this}
	 *
	 * @example
	 * Check(Infinity, 'val').is.infinity().ok(); // true
	 * Check(123, 'val').is.infinity().ok(); // false
	 */
	infinity() {
		return this.typeDetail('number (Infinity)');
	}

	// NOTE: Truthy/Falsy checks

	/**
	 * Coerces a value to a boolean and checks if it is a truthy value
	 * @returns {this}
	 *
	 * @example
	 * Check('string', 'val').is.truthy().ok(); // true
	 * Check(true, 'val').is.truthy().ok(); // true
	 * Check({}, 'val').is.truthy().ok(); // true
	 * Check(0, 'val').is.truthy().ok(); // false
	 * Check(null, 'val').is.truthy().ok(); // false
	 */
	truthy() {
		return this.run(
			{
				actual: !!this.value,
				predicate: 'truthy',
				expected: 'true',
				message: (d) => `expected value to ${d.invert ? 'NOT ' : ''}be truthy, received ${d.actual}`,
			},
			() => !!this.value === true,
		);
	}

	/**
	 * Coerces a value to a boolean and checks if it is a falsy value
	 * @returns {this}
	 *
	 * @example
	 * Check('string', 'val').is.falsy().ok(); // false
	 * Check(true, 'val').is.falsy().ok(); // false
	 * Check({}, 'val').is.falsy().ok(); // false
	 * Check(0, 'val').is.falsy().ok(); // true
	 * Check('', 'val').is.falsy().ok(); // true
	 * Check(NaN, 'val').is.falsy().ok(); // true
	 * Check(null, 'val').is.falsy().ok(); // true
	 */
	falsy() {
		return this.run(
			{
				actual: !!this.value,
				predicate: 'falsy',
				expected: 'false',
				message: (d) => `expected value to ${d.invert ? 'NOT ' : ''}be falsy, received ${d.actual}`,
			},
			() => !!this.value === false,
		);
	}

	/**
	 * Checks if the current value is strictly true.
	 * @returns {this}
	 *
	 * @example
	 * Check(true, 'val').is.true().ok(); // true
	 * Check('true', 'val').is.true().ok(); // false
	 */
	true() {
		return this.run(
			{
				actual: this.value,
				predicate: 'true',
				expected: true,
				message: (d) => `expected value to ${d.invert ? 'NOT ' : ''}be true, received ${d.actual}`,
			},
			() => this.value === true,
		);
	}

	/**
	 * Checks if the current value is strictly false.
	 * @returns {this}
	 *
	 * @example
	 * Check(false, 'val').is.false().ok(); // true
	 * Check(0, 'val').is.false().ok(); // false
	 */
	false() {
		return this.run(
			{
				actual: this.value,
				predicate: 'false',
				expected: false,
				message: (d) => `expected value to ${d.invert ? 'NOT ' : ''}be false, received ${d.actual}`,
			},
			() => this.value === false,
		);
	}

	// NOTE: complex object checks

	/**
	 * Checks if a value is an Array
	 * @returns {this}
	 *
	 * @example
	 * Check([1, 2, 3], 'val').is.array().ok(); // true
	 * Check({}, 'val').is.array().ok(); // false
	 */
	array() {
		return this.typeDetail('object (Array)');
	}

	/**
	 * Checks if a value is a Regular Expression
	 * @returns {this}
	 *
	 * @example
	 * Check(/abc/, 'val').is.regex().ok(); // true
	 * Check('abc', 'val').is.regex().ok(); // false
	 */
	regex() {
		return this.typeDetail('object (RegExp)');
	}

	/**
	 * Checks if a value is a Date object.
	 * Note that this is will only return true for a standard `Date` object instance.
	 * It does not check if a value is a `GlideDate` or `GlideDateTime` instance
	 * @returns {this}
	 *
	 * @example
	 * Check(new Date(), 'val').is.date().ok(); // true
	 * Check('2026-06-25', 'val').is.date().ok(); // false
	 */
	date() {
		return this.typeDetail('object (Date)');
	}

	/**
	 * Checks if a value is a plain object.
	 * A plain object is one with a prototype of Object.prototype or null
	 * @returns {this}
	 *
	 * @example
	 * Check({}, 'name').is.plainObject().ok(); // true
	 * Check(new GlideRecord, 'name').is.plainObject().ok(); // false
	 */
	plainObject() {
		// TODO: consider updating actual/expected to indicate the prototype as well,
		// as there are cases where object (Object) uses a custom class/prototype
		return this.run(
			{
				actual: this.typeofDetail,
				predicate: 'plainObject',
				expected: 'object (Object)',
			},
			() => Type.isPlainObject(this.value),
		);
	}

	/**
	 * Checks if the current value is an object and contains the specified property key.
	 * @param {string|symbol} key - the property key to check for
	 * @returns {this}
	 *
	 * @example
	 * Check({ id: 123 }, 'val').has.property('id').ok(); // true
	 * Check({}, 'val').has.property('id').ok(); // false
	 */
	property(key) {
		return this.run(
			{
				actual: this.value,
				predicate: 'property',
				expected: key,
				message: (d) => `expected object to ${d.invert ? 'NOT ' : ''}contain property "${d.expected}", received ${d.actual}`,
			},
			() => {
				if (this.typeof !== 'object' || this.value === null) return false;
				return key in this.value;
			},
		);
	}

	/**
	 * Checks if the current value is an object and contains the specified property key.
	 * Alias for [property](#property).
	 * @param {string|symbol} key - the property key to check for
	 * @returns {this}
	 *
	 * @example
	 * Check({ id: 123 }, 'val').hasProperty('id').ok(); // true
	 */
	hasProperty(key) {
		return this.property(key);
	}

	/**
	 * Checks if the current value is empty.
	 * Alias for [empty](#empty).
	 * @returns {this}
	 *
	 * @example
	 * Check('', 'val').is.blank().ok(); // true
	 */
	blank() {
		return this.empty();
	}

	/**
	 * Checks if the current value is an instance of the specified constructor/class.
	 * @param {Function} constructor - the constructor function or class to check against
	 * @returns {this}
	 *
	 * @example
	 * class MyClass {}
	 * let obj = new MyClass();
	 * Check(obj, 'instance').is.instanceOf(MyClass).ok(); // true
	 */
	instanceOf(constructor) {
		return this.run(
			{
				actual: this.value,
				predicate: 'instanceOf',
				expected: constructor,
				message: (d) => `expected value to ${d.invert ? 'NOT ' : ''}be an instance of ${d.expected?.name ?? 'constructor'}, received ${d.actual}`,
			},
			() => {
				if (typeof constructor !== 'function') throw TypeError('instanceOf(constructor) requires input to be a constructor function.');
				return this.value instanceof constructor;
			},
		);
	}

	// NOTE: equality checks

	/**
	 * Performs a strict equality (===) check on a value
	 * @param {*} expected - the expected value
	 * @returns {this}
	 * @example
	 * Check(1, 'number').is.equal(1).ok(); // true
	 * Check('1', 'number').is.equal(1).ok(); // false
	 */
	equal(expected) {
		return this.run(
			{
				actual: this.value,
				predicate: 'equal',
				expected,
			},
			() => this.value === expected,
		);
	}

	/**
	 * Performs a strict equality (===) check on a value.
	 * Alias for the [equal](#equal) method.
	 * @param {*} expected - the expected value
	 * @returns {this}
	 * @example
	 * Check(1, 'number').equals(1).ok(); // true
	 * Check('1', 'number').equals(1).ok(); // false
	 */
	equals(expected) {
		return this.equal(expected);
	}

	// NOTE: array/iterable checks

	/**
	 * Checks if a value is present in an array of values
	 * @param {any[]} array - array of allowed values
	 * @returns {this}
	 *
	 * @example
	 * Check(3).is.oneOf([1, 2, 3]).ok(); // true
	 * Check(4).is.oneOf([1, 2]).ok(); // false
	 */
	oneOf(array) {
		return this.run(
			{
				actual: this.value,
				predicate: 'oneOf',
				expected: array,
			},
			() => {
				if (!Array.isArray(array)) throw TypeError('oneOf(array) requires input to be an Array.');
				return array.indexOf(this.value) !== -1;
			},
		);
	}

	/**
	 * Checks if a value is not present in an array of values
	 * @param {any[]} array - array of values
	 * @returns {this}
	 *
	 * @example
	 * Check(3).is.noneOf([1, 2, 3]).ok(); // false
	 * Check(4).is.noneOf([1, 2, 3]).ok(); // true
	 */
	noneOf(array) {
		return this.run(
			{
				actual: this.value,
				predicate: 'noneOf',
				expected: array,
			},
			() => {
				if (!Array.isArray(array)) throw TypeError('noneOf(array) requires input to be an Array.');
				return array.indexOf(this.value) === -1;
			},
		);
	}

	/**
	 * Checks if the length is equal to the expected value.
	 * Intended for use with Arrays and strings, but works with any object containing a length property.
	 * @param {number} expected - the expected length
	 * @returns {this}
	 *
	 * @example
	 * Check([1, 2, 3], 'val').is.length(3).ok(); // true
	 * Check('hello', 'val').is.length(5).ok(); // true
	 */
	length(expected) {
		return this.run(
			{
				actual: this.value?.length,
				predicate: 'length',
				expected,
			},
			() => this.value?.length === expected,
		);
	}

	/**
	 * Checks if the length is between an expected min and max value.
	 * Intended for use with Arrays and strings, but works with any object containing a length property.
	 * @param {number} min - the minimum expected length
	 * @param {number} max - the maximum expected length
	 * @returns {this}
	 *
	 * @example
	 * Check([1, 2, 3], 'val').is.lengthBetween(1, 5).ok(); // true
	 * Check('hello', 'val').is.lengthBetween(6, 10).ok(); // false
	 */
	lengthBetween(min, max) {
		return this.run(
			{
				actual: this.value?.length,
				predicate: 'length',
				expected: `length to be between ${min} and ${max}`,
			},
			() => this.value?.length >= min && this.value?.length <= max,
		);
	}
	/**
	 * Checks if the length is greater than or equal to the expected minimum value.
	 * Intended for use with Arrays and strings, but works with any object containing a length property.
	 * @param {number} expected - the minimum expected length
	 * @returns {this}
	 *
	 * @example
	 * Check([1, 2, 3], 'val').is.minLength(2).ok(); // true
	 * Check('a', 'val').is.minLength(2).ok(); // false
	 */
	minLength(expected) {
		return this.run(
			{
				actual: this.value?.length,
				predicate: 'minLength',
				expected,
			},
			() => this.value?.length >= expected,
		);
	}

	/**
	 * Checks if the length is less than or equal to the expected maximum value.
	 * Intended for use with Arrays and strings, but works with any object containing a length property.
	 * @param {number} expected - the maximum expected length
	 * @returns {this}
	 *
	 * @example
	 * Check([1, 2, 3], 'val').is.maxLength(5).ok(); // true
	 * Check('hello world', 'val').is.maxLength(5).ok(); // false
	 */
	maxLength(expected) {
		return this.run(
			{
				actual: this.value?.length,
				predicate: 'maxLength',
				expected,
			},
			() => this.value?.length <= expected,
		);
	}

	/**
	 * Checks if the current value is empty.
	 * A value is empty if it is nil (null/undefined), an empty string, an empty array,
	 * or an object with no enumerable properties.
	 * @returns {this}
	 *
	 * @example
	 * Check('', 'val').is.empty().ok(); // true
	 * Check([], 'val').is.empty().ok(); // true
	 * Check('hello', 'val').not.empty().ok(); // true
	 */
	empty() {
		return this.run(
			{
				actual: this.value,
				predicate: 'empty',
				expected: 'empty',
			},
			() => {
				if (Type.isNil(this.value)) return true;
				if (typeof this.value === 'string' || Array.isArray(this.value)) {
					return this.value.length === 0;
				}
				if (Type.isPlainObject(this.value)) {
					return Object.keys(this.value).length === 0;
				}
				return false;
			},
		);
	}

	// NOTE: number checks

	/**
	 * Checks if a value is a finite number
	 * @returns {this}
	 */
	finite() {
		return this.run(
			{
				actual: this.typeofDetail,
				predicate: 'finite',
				expected: 'number (Integer) or number (Float)',
			},
			() => this.typeofDetail === 'number (Integer)' || this.typeofDetail === 'number (Float)',
		);
	}

	/**
	 * Checks if a value is a positive number
	 * @returns {this}
	 *
	 * @example
	 * Check(3, 'Positive').is.positive().ok(); // true
	 * Check(-3, 'Negative').is.positive().ok(); // false
	 * Check(0, 'Zero').is.positive().ok(); // false
	 */
	positive() {
		return this.greaterThan(0);
	}

	/**
	 * Checks if a value is a negative number
	 * @returns {this}
	 *
	 * @example
	 * Check(3, 'Positive').is.negative().ok(); // false
	 * Check(-3, 'Negative').is.negative().ok(); // true
	 * Check(0, 'Zero').is.negative().ok(); // false
	 */
	negative() {
		return this.lessThan(0);
	}

	/**
	 * Checks if a value is between or equal to a min and max value
	 * @param {number} min - the minimum value
	 * @param {number} max - the maximum value
	 * @returns {this}
	 *
	 * @example
	 * Check(3, 'Positive').is.between(0, 5).ok(); // true
	 * Check(-3, 'Negative').is.between(0, 5).ok(); // false
	 * Check(0, 'Zero').is.between(0, 5).ok(); // true
	 */
	between(min, max) {
		return this.run(
			{
				actual: this.value,
				predicate: 'between',
				expected: `value >= ${min} and <= ${max}`,
			},
			() => this.value >= min && this.value <= max,
		);
	}

	/**
	 * Checks if a value is less than the expected value
	 * @param {number} expected - the expected value
	 * @returns {this}
	 *
	 * @example
	 * Check(3, 'val').is.lessThan(5).ok(); // true
	 * Check(5, 'val').is.lessThan(5).ok(); // false
	 */
	lessThan(expected) {
		return this.run(
			{
				actual: this.value,
				predicate: 'lessThan',
				expected,
			},
			() => this.value < expected,
		);
	}

	/**
	 * Checks if a value is less than the expected value.
	 * Alias for [lessThan](#lessthan).
	 * @param {number} expected - the expected value
	 * @returns {this}
	 *
	 * @example
	 * Check(3, 'val').less(5).ok(); // true
	 */
	less(expected) {
		return this.lessThan(expected);
	}

	/**
	 * Checks if a value is less than the expected value.
	 * Alias for [lessThan](#lessthan).
	 * @param {number} expected - the expected value
	 * @returns {this}
	 *
	 * @example
	 * Check(3, 'val').lt(5).ok(); // true
	 */
	lt(expected) {
		return this.less(expected);
	}

	/**
	 * Checks if a value is less than or equal to the expected value.
	 * @param {number} expected - the expected value
	 * @returns {this}
	 *
	 * @example
	 * Check(5, 'val').is.lessThanOrEqual(5).ok(); // true
	 * Check(6, 'val').is.lessThanOrEqual(5).ok(); // false
	 */
	lessThanOrEqual(expected) {
		return this.run(
			{
				actual: this.value,
				predicate: 'lessThanOrEqual',
				expected,
			},
			() => this.value <= expected,
		);
	}

	/**
	 * Checks if a value is less than or equal to the expected value.
	 * Alias for [lessThanOrEqual](#lessthanorequal).
	 * @param {number} expected - the expected value
	 * @returns {this}
	 *
	 * @example
	 * Check(5, 'val').lessOrEqual(5).ok(); // true
	 */
	lessOrEqual(expected) {
		return this.lessThanOrEqual(expected);
	}

	/**
	 * Checks if a value is less than or equal to the expected value.
	 * Alias for [lessThanOrEqual](#lessthanorequal).
	 * @param {number} expected - the expected value
	 * @returns {this}
	 *
	 * @example
	 * Check(5, 'val').lte(5).ok(); // true
	 */
	lte(expected) {
		return this.lessOrEqual(expected);
	}

	/**
	 * Checks if a value is greater than the expected value.
	 * @param {number} expected - the expected value
	 * @returns {this}
	 *
	 * @example
	 * Check(5, 'val').is.greaterThan(3).ok(); // true
	 * Check(3, 'val').is.greaterThan(3).ok(); // false
	 */
	greaterThan(expected) {
		return this.run(
			{
				actual: this.value,
				predicate: 'greaterThan',
				expected,
			},
			() => this.value > expected,
		);
	}

	/**
	 * Checks if a value is greater than the expected value.
	 * Alias for [greaterThan](#greaterthan).
	 * @param {number} expected - the expected value
	 * @returns {this}
	 *
	 * @example
	 * Check(5, 'val').greater(3).ok(); // true
	 */
	greater(expected) {
		return this.greaterThan(expected);
	}

	/**
	 * Checks if a value is greater than the expected value.
	 * Alias for [greaterThan](#greaterthan).
	 * @param {number} expected - the expected value
	 * @returns {this}
	 *
	 * @example
	 * Check(5, 'val').gt(3).ok(); // true
	 */
	gt(expected) {
		return this.greaterThan(expected);
	}

	/**
	 * Checks if a value is greater than or equal to the expected value.
	 * @param {number} expected - the expected value
	 * @returns {this}
	 *
	 * @example
	 * Check(5, 'val').is.greaterThanOrEqual(5).ok(); // true
	 * Check(4, 'val').is.greaterThanOrEqual(5).ok(); // false
	 */
	greaterThanOrEqual(expected) {
		return this.run(
			{
				actual: this.value,
				predicate: 'greaterThanOrEqual',
				expected,
			},
			() => this.value >= expected,
		);
	}

	/**
	 * Checks if a value is greater than or equal to the expected value.
	 * Alias for [greaterThanOrEqual](#greaterthanorequal).
	 * @param {number} expected - the expected value
	 * @returns {this}
	 *
	 * @example
	 * Check(5, 'val').greaterOrEqual(5).ok(); // true
	 */
	greaterOrEqual(expected) {
		return this.greaterThanOrEqual(expected);
	}

	/**
	 * Checks if a value is greater than or equal to the expected value.
	 * Alias for [greaterThanOrEqual](#greaterthanorequal).
	 * @param {number} expected - the expected value
	 * @returns {this}
	 *
	 * @example
	 * Check(5, 'val').gte(5).ok(); // true
	 */
	gte(expected) {
		return this.greaterThanOrEqual(expected);
	}

	/**
	 * Checks if a value is a multiple of the expected value.
	 * @param {number} expected - number the value should be a multiple of
	 * @returns {this}
	 *
	 * @example
	 * Check(10, 'val').is.multipleOf(5).ok(); // true
	 * Check(12, 'val').is.multipleOf(5).ok(); // false
	 */
	multipleOf(expected) {
		return this.run(
			{
				actual: this.value,
				predicate: 'multipleOf',
				expected: `multiple of ${expected}`,
			},
			() => this.value % expected === 0,
		);
	}

	// NOTE: ServiceNow/Glide API checks

	/**
	 * Checks if the current value is a valid ServiceNow table name.
	 * @returns {this}
	 *
	 * @example
	 * Check('sys_user', 'val').is.validTable().ok(); // true
	 */
	validTable() {
		return this.run(
			{
				actual: this.value,
				predicate: 'validTable',
				expected: 'valid table name',
			},
			() => {
				if (this.typeof !== 'string') return false;
				let gr = new GlideRecord(this.value);
				return gr.isValid();
			},
		);
	}

	/**
	 * Checks if the current value is a valid GlideRecord or GlideRecordSecure instance.
	 * @returns {this}
	 *
	 * @example
	 * let gr = new GlideRecord('sys_user');
	 * Check(gr, 'val').is.validRecord().ok(); // true
	 */
	validRecord() {
		return this.run(
			{
				actual: this.value,
				predicate: 'validRecord',
				expected: 'valid GlideRecord',
			},
			() => {
				if (
					!(
						this.typeofDetail === 'object (GlideRecord)'
						|| this.typeofDetail === 'object (GlideRecordSecure)'
					)
				) {
					return false;
				}
				return this.value.isValidRecord();
			},
		);
	}

	/**
	 * Checks if the current value is a GlideDate instance.
	 * @returns {this}
	 *
	 * @example
	 * Check(new GlideDate(), 'date').is.glideDate().ok(); // true
	 */
	glideDate() {
		return this.typeDetail('object (GlideDate)');
	}

	/**
	 * Checks if the current value is a GlideDateTime instance.
	 * @returns {this}
	 *
	 * @example
	 * Check(new GlideDateTime(), 'dateTime').is.glideDateTime().ok(); // true
	 */
	glideDateTime() {
		return this.typeDetail('object (GlideDateTime)');
	}

	/**
	 * Checks if the current value is a GlideDuration instance.
	 * @returns {this}
	 *
	 * @example
	 * Check(new GlideDuration(), 'duration').is.glideDuration().ok(); // true
	 */
	glideDuration() {
		return this.typeDetail('object (GlideDuration)');
	}

	/**
	 * Checks if the current value is a GlideSchedule instance.
	 * @returns {this}
	 *
	 * @example
	 * Check(new GlideSchedule(), 'schedule').is.glideSchedule().ok(); // true
	 */
	glideSchedule() {
		return this.typeDetail('object (GlideSchedule)');
	}

	/**
	 * Checks if the current value is a GlideSession instance.
	 * @returns {this}
	 *
	 * @example
	 * Check(gs.getSession(), 'session').is.glideSession().ok(); // true
	 */
	glideSession() {
		return this.typeDetail('object (GlideSession)');
	}

	/**
	 * Checks if the current value is a GlideUser instance.
	 * @returns {this}
	 *
	 * @example
	 * Check(gs.getUser(), 'user').is.glideUser().ok(); // true
	 */
	glideUser() {
		return this.typeDetail('object (GlideUser)');
	}

	// NOTE: terminal operation methods

	/**
	 * Checks the entire validation chain for errors
	 * @returns {boolean} true if there were no validation errors
	 *
	 * @example
	 * let pass = Check(10, 'num').is.number().ok(); // true
	 */
	ok() {
		return this.errors.length === 0;
	}

	/**
	 * Returns the validation result summary
	 * @returns {{ok: boolean, checks: CheckDetail[], errors: string[]}} result summary containing ok status, list of checks, and errors
	 *
	 * @example
	 * let res = Check('hello', 'val').is.string().result();
	 * // res.ok -> true
	 */
	result() {
		return {
			ok: this.ok(),
			checks: this.checks.slice(),
			errors: this.errors.slice(),
		};
	}

	/**
	 * Checks the current validation status and throws a TypeError if not ok
	 * @returns {this} the current Checker instance
	 * @throws {TypeError} if any validation checks failed
	 *
	 * @example
	 * Check('hello', 'val').is.number().guard(); // throws TypeError
	 */
	guard() {
		if (!this.ok()) {
			throw TypeError(this.errors.join('\n'));
		}
		return this;
	}

	/**
	 * Asserts that the current value satisfies a custom predicate function.
	 * @param {function(*): boolean} predicateFn - function that takes the current value and returns a boolean
	 * @param {string} [expectedDescription] - description of the custom check for error messaging
	 * @returns {this}
	 *
	 * @example
	 * Check(4, 'num').is.satisfies((val) => val % 2 === 0, 'an even number').ok(); // true
	 */
	satisfies(predicateFn, expectedDescription) {
		const expected = expectedDescription ?? 'satisfies custom predicate';
		return this.run(
			{
				actual: this.value,
				predicate: 'satisfies',
				expected,
				message: (d) => `expected value to satisfy custom check "${d.expected}", received ${d.actual}`,
			},
			() => {
				if (typeof predicateFn !== 'function') throw TypeError('satisfies() requires a callback function.');
				return !!predicateFn(this.value);
			},
		);
	}

	/**
	 * Overrides the error message for the most recently evaluated check in the chain.
	 * @param {string|function(CheckDetail): string} msg - custom error message string or function
	 * @returns {this}
	 *
	 * @example
	 * Check(password).is.minLength(8).message('Password is too short.').guard();
	 */
	message(msg) {
		if (this.checks.length > 0) {
			const lastCheck = this.checks[this.checks.length - 1];
			if (!lastCheck.pass) {
				// Update check detail message
				lastCheck.message = msg;
				// Replace the last error with the newly formatted error
				this.errors[this.errors.length - 1] = this.formatError(lastCheck);
			}
		}
		return this;
	}

	/**
	 * Overrides the error message for the most recently evaluated check in the chain.
	 * Alias for [message](#message).
	 * @param {string|function(CheckDetail): string} msg - custom error message string or function
	 * @returns {this}
	 *
	 * @example
	 * Check(password).is.minLength(8).msg('Password is too short.').guard();
	 */
	msg(msg) {
		return this.message(msg);
	}

	// NOTE: execution/evaluation methods

	/**
	 * Evaluates a validation predicate, finalizes pass/fail status,
	 * records check details, appends errors if failed, and resets the inversion flag.
	 * @param {Partial<CheckDetail>} detail - object containing details on the current check
	 * @param {function(): boolean} predicate - callback function that must return a boolean indicating if the check passed
	 * @returns {this} the current Checker instance
	 */
	run(detail, predicate) {
		if (!predicate || typeof predicate !== 'function') throw TypeError('predicate parameter must be a function');
		if (!detail || typeof detail !== 'object') throw TypeError('detail parameter must be an object');

		/*
		 * snapshot the user provided values before the predicate is ran,
		 * as they may occasionally need to manipulate state, like optional()
		 */
		const invert = this.invert;

		// skip remaining predicates in this check chain
		if (this.abort) {
			this.invert = false;
			return this;
		}

		// pass, fail, skip, error
		let pass = true;
		let status = null;
		let exception = false;
		let exceptionMessage = null;

		try {
			pass = !!predicate();
			if (invert) pass = !pass;
			// predicate may override status (i.e., optional() sets status to "skip")
			status = detail.status ?? (pass ? 'pass' : 'fail');
			if (status === 'skip') pass = true;
		} catch (ex) {
			pass = false;
			status = 'error';
			exception = true;
			exceptionMessage = 'predicate threw an exception: ' + ex.message;
		}

		detail = {
			name: this.name,
			pass,
			status,
			exception,
			invert,
			...detail,
			message: exceptionMessage ?? detail.message,
		};

		// add a new error message if the check failed
		if (!pass) {
			this.abort = true;
			this.errors.push(this.formatError(detail));
		}
		this.checks.push(detail);

		// reset result inversion flag
		this.invert = false;
		return this;
	}

	/**
	 * Used to append additional checks to an existing Checker
	 * @param {*} value - the value to be checked
	 * @param {string} [name] - name or label of the value being checked
	 * @returns {this} the current Checker instance
	 *
	 * @example
	 * let checker = Check(5, 'num').is.positive();
	 * checker.check('hello', 'str').is.string();
	 * checker.ok(); // true (both checks passed)
	 */
	check(value, name) {
		this.checkCount++;

		// if a name isn't provided, accept an object with a single name:value pair
		// to use as the name and value for the Checker instance
		if (!name && value && Type.isPlainObject(value)) {
			let keys = Object.keys(value);
			if (keys.length === 1) {
				this.value = value[keys[0]];
				this.name = keys[0];
			}
		} else {
			this.value = value;
			this.name = name ?? `value #${this.checkCount}`;
		}

		this.typeof = typeof this.value;
		this.typeofDetail = Type.detail(this.value);
		this.invert = false;
		this.abort = false;
		return this;
	}

	// NOTE: Formatter functions

	/**
	 * Generates an error message from a CheckDetail object
	 * @param {CheckDetail} detail - detail object for the current check/predicate
	 * @returns {string} returns the formatted error message
	 */
	formatError(detail) {
		if (typeof detail.message === 'function') {
			return `${detail.name}: ${detail.message(detail)}`;
		}

		if (typeof detail.message === 'string') {
			return `${detail.name}: ${detail.message}`;
		}

		return `${detail.name}: expected value to ${detail.invert ? 'NOT ' : ''}be ${detail.expected}, received ${detail.actual}`;
	}
}
