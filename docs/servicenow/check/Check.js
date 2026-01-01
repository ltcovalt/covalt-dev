/**
 * Input validation and error handling library that that uses a fluent, chainable API.
 * Leverages a standard JavaScript class and public factory function rather than Prototype.js.
 * Multiple validations can be chained together and a validation chain can be configured to
 * throw an error or simply return a result object containing details on the checks performed.
 * Leverages a standard JavaScript class instead of Prototype.js.
 * @module
 */

/**
 * @typedef {Object} CheckDetail - details the results of each predicate check performed
 * @property {boolean} pass - true if the check was passed
 * @property {'pass'|'fail'|'skip'|'error'} status - status of a predicate evaluation
 * @property {string} [message] - additional information about the status
 * @property {boolean} invert - true if the check result should be inverted
 * @property {boolean} abort - set to true when a predicate fails, skipping remaining predicates for the current check
 * @property {any} actual - the actual value received
 * @property {string} predicate - name of the predicate function that was ran
 * @property {any} expected - the expected value
 */

/**
 * Factory function for the Checker class
 * @param {*} value - the value to be checked
 * @param {string} name - the name or label of the value being checked
 * @returns {Checker} a new Checker instance
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
 * Performs runtime type validation and error handling
 *
 * @property {any} value - the current value being processed
 * @property {string} name - name or label of the current value being processed
 * @property {string} typeof - type of the current value
 * @property {string} typeofDetail - detailed typeof the current value
 * @property {boolean} invert - controls if the result should be inverted, used when "not" is included in the call chain
 * @property {object[]} checks - array of objects detailing each check that was performed
 * @property {object[]} errors - array of objects detailing validation errors
 */
class Checker {
	/**
	 * Creates a new Checker object instance
	 * @param {*} value - the value to be checked
	 * @param {string} name - the name or label of the value being checked
	 */
	constructor(value, name) {
		/** @type {number} */
		this.checkCount = 1;
		/** @type {any} */
		this.value = value;
		/** @property {string} */
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
	 */
	get a() {
		return this;
	}
	/**
	 * No-op helper used solely to make fluent chaining more readable
	 * @returns {this}
	 */

	get an() {
		return this;
	}

	/**
	 * No-op helper used solely to make fluent chaining more readable
	 * @returns {this}
	 */
	get are() {
		return this;
	}

	/**
	 * No-op helper used solely to make fluent chaining more readable
	 * @returns {this}
	 */
	get be() {
		return this;
	}

	/**
	 * No-op helper used solely to make fluent chaining more readable
	 * @returns {this}
	 */
	get has() {
		return this;
	}

	/**
	 * No-op helper used solely to make fluent chaining more readable
	 * @returns {this}
	 */
	get is() {
		return this;
	}

	/**
	 * No-op helper used solely to make fluent chaining more readable
	 * @returns {this}
	 */
	get to() {
		return this;
	}

	/**
	 * No-op helper used solely to make fluent chaining more readable
	 * @returns {this}
	 */
	get have() {
		return this;
	}

	// NOTE: behavior modifiers

	/**
	 * Sets the current value being checked as required.
	 * If invoked as not.required(), delegates to [optional()](#optional).
	 * @returns {this}
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
			},
			() => !Type.isNil(this.value),
		);
	}

	/**
	 * Sets the current value being checked as optional.
	 * If invoked as `not.optional()`, delegates to [required()](#required).
	 * @returns {this}
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
	 */
	opt() {
		return this.optional();
	}

	// NOTE: core type predicates

	/**
	 * Checks if the current value is the expected type
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
			},
			() => this.typeof === expected,
		);
	}

	/**
	 * Checks if the detailed type of the current value is the expected type
	 * @returns {this}
	 *
	 * @example
	 * let testValue = new GlideRecord('sys_user');
	 * let pass = Check({ testValue }).is.typeDetail('object (GlideRecord)'); // true
	 *
	 * @example
	 * let testValue = {};
	 * let pass = Check({ testValue }).is.typeDetail('object (Object)'); // true
	 */
	typeDetail(expected) {
		return this.run(
			{
				actual: this.typeofDetail,
				predicate: 'typeDetail',
				expected,
			},
			() => this.typeofDetail === expected,
		);
	}

	// NOTE: basic type checks

	/**
	 * Checks if a value is a string
	 * @returns {this}
	 */
	string() {
		return this.type('string');
	}

	/**
	 * Checks if a value is a number
	 * @returns {this}
	 */
	number() {
		return this.type('number');
	}

	/**
	 * Checks if a value is a bigint
	 * @returns {this}
	 */
	bigint() {
		return this.type('bigint');
	}

	/**
	 * Checks if a value is a boolean
	 * @returns {this}
	 */
	boolean() {
		return this.type('boolean');
	}

	/**
	 * Checks if a value is a function
	 * @returns {this}
	 */
	function() {
		return this.type('function');
	}

	/**
	 * Checks if a value is an object
	 * @returns {this}
	 */
	object() {
		return this.type('object');
	}

	/**
	 * Checks if a value is null
	 * @returns {this}
	 */
	null() {
		return this.typeDetail('object (Null)');
	}

	/**
	 * Checks if a value is undefined
	 * @returns {this}
	 */
	undefined() {
		return this.type('undefined');
	}

	/**
	 * Checks if a value is null or undefined
	 * @returns {this}
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
	 */
	symbol() {
		return this.type('symbol');
	}

	/**
	 * Checks if a value is an integer
	 * @returns {this}
	 */
	integer() {
		return this.typeDetail('number (Integer)');
	}

	/**
	 * Checks if a value is a float/decimal number
	 * @returns {this}
	 */
	float() {
		return this.typeDetail('number (Float)');
	}

	/**
	 * Checks if a value is Not-a-Number (NaN)
	 * @returns {this}
	 */
	nan() {
		return this.typeDetail('number (NaN)');
	}

	/**
	 * Checks if a value is Infinity
	 * @returns {this}
	 */
	infinity() {
		return this.typeDetail('number (Infinity)');
	}

	// NOTE: Truthy/Falsy checks

	/**
	 * Coerces a value to a boolean and checks if it is a truthy value
	 * returns {this}
	 *
	 * @example
	 * Check('string', name).is.truthy().ok(); // true
	 * Check(true, name).is.truthy().ok(); // true
	 * Check({}, name).is.truthy().ok(); // true
	 * Check(0, name).is.truthy().ok(); // false
	 * Check(null, name).is.truthy().ok() // false
	 */
	truthy() {
		return this.run(
			{
				actual: !!this.value,
				predicate: 'truthy',
				expected: 'true',
			},
			() => !!this.value === true,
		);
	}

	/**
	 * Coerces a value to a boolean and checks if it is a falsy value
	 * returns {this}
	 *
	 * @example
	 * Check('string', name).is.falsy().ok(); // false
	 * Check(true, name).is.falsy().ok(); // false
	 * Check({}, name).is.falsy().ok(); // false
	 * Check(0, name).is.falsy().ok(); // true
	 * Check('', name).is.falsy().ok(); // true
	 * Check(NaN, name).is.falsy().ok(); // true
	 * Check(null, name).is.falsy().ok() // true
	 */
	falsy() {
		return this.run(
			{
				actual: !!this.value,
				predicate: 'falsy',
				expected: 'false',
			},
			() => !!this.value === false,
		);
	}

	// NOTE: complex object checks

	/**
	 * Checks if a value is an Array
	 * @returns {this}
	 */
	array() {
		return this.typeDetail('object (Array)');
	}

	/**
	 * Checks if a value is a Regular Expression
	 * @returns {this}
	 */
	regex() {
		return this.typeDetail('object (RegExp)');
	}

	/**
	 * Checks if a value is a Date object.
	 * Note that this is will only return true for a standard `Date` object instance.
	 * It does not check if a value is a `GlideDate` or `GlideDateTime` instance
	 * @returns {this}
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

	// NOTE: equality checks

	/**
	 * Performs a strict equality (===) check on a value
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
	 * @returns {this}
	 * @example
	 * Check(1, 'number').equals(1).ok(); // true
	 * Check('1', 'number').equals(1).ok(); // false
	 */
	equals(expected) {
		return this.equal(expected);
	}

	// NOTE: array checks

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
	 * @param {any[]} array of values
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
	 * Checks if the length is greater than or equal to the expected minimum value.
	 * Intended for use with Arrays and strings, but works with any object containing a length property.
	 * @param {number} expected - the minimum expected length
	 * @returns {this}
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
	 * Check(3, 'Positive').is.positive(); // true
	 * Check(-3, 'Negative').is.positive(); // false
	 * Check(0, 'Zero').is.positive(); // false
	 */
	positive() {
		return this.greaterThan(0);
	}

	/**
	 * Checks if a value is a negative number
	 * @returns {this}
	 *
	 * @example
	 * Check(3, 'Positive').is.negative(); // false
	 * Check(-3, 'Negative').is.negative(); // true
	 * Check(0, 'Zero').is.negative(); // false
	 */
	negative() {
		return this.lessThan(0);
	}

	/**
	 * Checks if a value is between or equal to a min and max value
	 * @returns {this}
	 *
	 * @example
	 * Check(3, 'Positive').is.between(0, 5); // true
	 * Check(-3, 'Negative').is.between(0, 5); // false
	 * Check(0, 'Zero').is.between(0, 5); // true
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
	 */
	less(expected) {
		return this.lessThan(expected);
	}

	/**
	 * Checks if a value is less than the expected value.
	 * Alias for [lessThan](#lessthan).
	 * @param {number} expected - the expected value
	 * @returns {this}
	 */
	lt(expected) {
		return this.less(expected);
	}

	/**
	 * Checks if a value is less than or equal to the expected value.
	 * @param {number} expected - the expected value
	 * @returns {this}
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
	 */
	lessOrEqual(expected) {
		return this.lessThanOrEqual(expected);
	}

	/**
	 * Checks if a value is less than or equal to the expected value.
	 * Alias for [lessThanOrEqual](#lessthanorequal).
	 * @param {number} expected - the expected value
	 * @returns {this}
	 */
	lte(expected) {
		return this.lessOrEqual(expected);
	}

	/**
	 * Checks if a value is greater than the expected value.
	 * @param {number} expected - the expected value
	 * @returns {this}
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
	 */
	greater(expected) {
		return this.greaterThan(expected);
	}

	/**
	 * Checks if a value is greater than the expected value.
	 * Alias for [greaterThan](#greaterthan).
	 * @param {number} expected - the expected value
	 * @returns {this}
	 */
	gt(expected) {
		return this.greaterThan(expected);
	}

	/**
	 * Checks if a value is greater than or equal to the expected value.
	 * @param {number} expected - the expected value
	 * @returns {this}
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
	 */
	greaterOrEqual(expected) {
		return this.greaterThanOrEqual(expected);
	}

	/**
	 * Checks if a value is greater than or equal to the expected value.
	 * Alias for [greaterThanOrEqual](#greaterthanorequal).
	 * @param {number} expected - the expected value
	 * @returns {this}
	 */
	gte(expected) {
		return this.greaterThanOrEqual(expected);
	}

	/**
	 * Checks if a values is a multiple of the expected value.
	 * @param {number} expected - number the value should be a multiple of
	 * @returns {this}
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

	// NOTE: terminal operation methods

	/**
	 * Checks the entire validation chain for errors
	 * @returns {boolean} true if there were no validation errors
	 */
	ok() {
		return this.errors.length === 0;
	}

	/**
	 * Returns the type validation result
	 * @returns {object} result summary
	 * @property {boolean} ok - true if there were no validation errors
	 * @property {string[]} errors - array of validation errors, if any
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
	 */
	guard() {
		if (!this.ok()) {
			throw TypeError(this.errors.join('\n'));
		}
		return this;
	}

	// NOTE: execution/evaluation methods

	/**
	 * evaluates a Type.check() call chain, finalizes pass/fail,
	 * records full check details, and logs/throws errors,
	 * and resets the inversion flag for the next check
	 * @param {object} detail - object containing details on the current check chain
	 * @param {function} predicate - callback function to determine if a check passed - must return a Boolean
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
	 * @param {string} name - name or label of the value being checked
	 * @returns {this} the current Checker instance
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
	 * @return {string} returns the formatted error message
	 */
	formatError(detail) {
		if (typeof detail.message === 'string') {
			return `${detail.name}: ${detail.message}`;
		}

		switch (detail.predicate) {
			case 'required':
				return `${detail.name}: expected a required value, received ${detail.actual}`;
			case 'type':
				return `${detail.name}: expected type to ${detail.invert ? 'NOT ' : ''}be ${detail.expected}, received ${detail.actual}`;
			case 'typeDetail':
				return `${detail.name}: expected detailed type to ${detail.invert ? 'NOT ' : ''} be ${detail.expected}, received ${detail.actual}`;
			case 'truthy':
			case 'falsy':
				return `${detail.name}: expected value to ${detail.invert ? 'NOT ' : ''}be ${detail.predicate}, received ${detail.actual}`;
			default:
				return `${detail.name}: expected value to ${detail.invert ? 'NOT ' : ''}be ${detail.expected}, received ${detail.actual}`;
		}
	}
}
