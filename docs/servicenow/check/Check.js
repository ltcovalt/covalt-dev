/**
 * Input validation and error handling library that that uses a fluent, chainable API.
 * Leverages a standard JavaScript class instead of Prototype.js.
 * @module
 */

/**
 * @typedef {Object} CheckDetail - details the results of each predicate check performed
 * @property {boolean} pass - true if the check was passed
 * @property {boolean} inverse - true if the check result should be inverted
 * @property {any} actual - the actual value received
 * @property {string} predicate - name of the predicate function that was ran
 * @property {string} prefix - prefix to append to the label
 * @property {string} label - user readable label for the predicate
 * @property {any} expected - the expected value
 */

/**
 * Factory function for the Checker class
 * @param {*} value - the value to be checked
 * @param {string} name - the name or label of the value being checked
 * @returns {Checker} a new Checker instance
 */
const Check = (value, name) => {
	// if a name isn't provided, accept an object with a single name:value pair to use as the name and value for the Checker instance
	if (!name && value && Type.isPlainObject(value)) {
		let keys = Object.keys(value);
		if (keys.length === 1) {
			return new Checker(value[keys[0]], keys[0]);
		}
	}
	return new Checker(value, name);
};

/**
 * Template formatter functions
 * @hidden
 * prettier-ignore
 */
const TEMPLATE_MAP = Object.freeze({
	type: (o) => `${o.name}: expected ${o.label} ${o.prefix}${o.expected}, received ${o.actual}`,
	truthy: (o) => `${o.name}: expected value to ${o.prefix}be ${o.predicate}, received ${o.actual}`,
	DEFAULT: (o) => `${o.name}: expected value to ${o.prefix}be ${o.expected}, received ${o.actual}`,
});

/**
 * Maps predicates to templates
 * @hidden
 */
const PREDICATE_TEMPLATE = Object.freeze({
	type: 'type',
	typeDetail: 'type',
	truthy: 'truthy',
	falsy: 'truthy',
});

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
	 * Creates a new TypeChecker object instance
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
	}

	/**
	 * Returns the prefix to be used for crafting user-readable strings
	 * @returns {string}
	 */
	get prefix() {
		return this.invert ? 'NOT ' : '';
	}

	// NOTE: modifiers

	/**
	 * Inverts the result when the next set of validations is evaluated
	 * @returns {this}
	 */
	get not() {
		this.invert = !this.invert;
		return this;
	}

	// TODO: passthrough getters to make API calls grammically accurate
	// consider limiting which predicates are available for each getter

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
	get are() {
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
	get have() {
		return this;
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
		this.evaluate(this.typeof === expected, {
			actual: this.typeof,
			predicate: 'type',
			label: 'type of',
			expected,
		});
		return this;
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
		this.evaluate(this.typeofDetail === expected, {
			actual: this.typeofDetail,
			predicate: 'typeDetail',
			label: 'detailed type of',
			expected,
		});
		return this;
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

	/**
	 * Checks if a value is a finite number
	 * @returns {this}
	 */
	finite() {
		this.evaluate(this.typeofDetail === 'number (Integer)' || this.typeofDetail === 'number (Float)', {
			actual: this.typeofDetail,
			predicate: 'finite',
			label: 'finite number',
			expected: 'number (Integer) or number (Float)',
		});
		return this;
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
		this.evaluate(!!this.value === true, {
			actual: !!this.value,
			predicate: 'truthy',
			label: 'truthy',
			expected: 'true',
		});
		return this;
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
		this.evaluate(!!this.value === false, {
			actual: !!this.value,
			predicate: 'falsy',
			label: 'falsy',
			expected: 'false',
		});
		return this;
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
	 * Checks if a value is null or undefined
	 * @returns {this}
	 */
	nil() {
		let pass = this.value === null || this.value === undefined ? true : false;
		this.evaluate(pass, {
			actual: this.typeof,
			predicate: 'nil',
			label: 'null or undefined',
			expected: 'null or undefined',
		});
		return this;
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
		this.evaluate(Type.isPlainObject(this.value), {
			actual: this.typeofDetail,
			predicate: 'plainObject',
			label: 'plain object',
			expected: 'object (Object)',
		});
		return this;
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
		this.evaluate(this.value === expected, {
			actual: this.value,
			predicate: 'equal',
			label: 'equal to',
			expected,
		});
		return this;
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

	/**
	 * Checks if a value is present in an array of values
	 * @param {any[]} array of values
	 * @returns {this}
	 * @example
	 * Check(3).is.oneOf([1, 2, 3]).ok(); // true
	 * Check(4).is.oneOf([1, 2]).ok(); // fals
	 */
	oneOf(array) {
		this.evaluate(array.indexOf(this.value) !== -1, {
			actual: this.value,
			predicate: 'oneOf',
			label: 'one of',
			expected: array,
		});
		return this;
	}

	/**
	 * Checks if a value is not present in an array of values
	 * @param {any[]} array of values
	 * @returns {this}
	 * @example
	 * Check(3).is.noneOf([1, 2, 3]).ok(); // false
	 * Check(4).is.noneOf([1, 2, 3]).ok(); // true
	 */
	noneOf(array) {
		this.evaluate(array.indexOf(this.value) === -1, {
			actual: this.value,
			predicate: 'noneOf',
			label: 'none of',
			expected: array,
		});
		return this;
	}

	// NOTE: numeric constraints

	/**
	 * Checks if a value is a positive number
	 * @returns {this}
	 */
	positive() {
		return this.greaterThan(0);
	}

	/**
	 * Checks if a value is a negative number
	 * @returns {this}
	 */
	negative() {
		return this.lessThan(0);
	}

	/**
	 * Checks if a value is less than the expected value
	 * @param {number} expected - the expected value
	 * @returns {this}
	 */
	lessThan(expected) {
		this.evaluate(this.value < expected, {
			actual: this.value,
			predicate: 'lessThan',
			label: 'less than',
			expected,
		});
		return this;
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
		this.evaluate(this.value <= expected, {
			actual: this.value,
			predicate: 'lessThanOrEqual',
			label: 'less than or equal to',
			expected,
		});
		return this;
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
		this.evaluate(this.value > expected, {
			actual: this.value,
			predicate: 'greaterThan',
			label: 'greater than',
			expected,
		});
		return this;
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
		this.evaluate(this.value >= expected, {
			actual: this.value,
			predicate: 'greaterThanOrEqual',
			label: 'greater than or equal to',
			expected,
		});
		return this;
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
		this.evaluate(this.value % expected === 0, {
			actual: this.value,
			predicate: 'multipleOf',
			label: 'multiple of',
			expected: `multiple of ${expected}`,
		});
		return this;
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
			checks: [...this.checks],
			errors: [...this.errors],
		};
	}

	/**
	 * Checks the current validation status and throws a TypeError if not ok
	 * @returns {this} the current TypeChecker instance
	 */
	guard() {
		if (!this.ok()) {
			throw TypeError(this.errors.join('\n'));
		}
		return this;
	}

	// NOTE: evaluation methods

	/**
	 * evaluates a Type.check() call chain, finalizes pass/fail,
	 * records full check details, and logs/throws errors,
	 * and resets the inversion flag for the next check
	 */
	evaluate(pass, detail) {
		pass = this.invert ? !pass : pass;

		detail = {
			name: this.name,
			pass,
			inverse: this.invert,
			prefix: this.prefix,
			...detail,
		};

		// add a new error message if the check failed
		if (!pass) {
			let template = PREDICATE_TEMPLATE[detail.predicate] || 'DEFAULT';
			let formatFn = TEMPLATE_MAP[template] || TEMPLATE_MAP.DEFAULT;
			this.errors.push(formatFn(detail));
		}
		this.checks.push(detail);

		// reset the result inversion flag
		this.invert = false;
		return this;
	}

	/**
	 * used to append additional checks to an existing TypeChecker
	 * @param {*} value - the value to be checked
	 * @param {string} name - name or label of the value being checked
	 * @returns {this} the current TypeChecker instance
	 */
	check(value, name) {
		this.checkCount++;
		this.value = value;
		this.name = name ?? `value #${this.checkCount}`;
		this.typeof = typeof this.value;
		this.typeofDetail = Type.detail(this.value);
		this.invert = false;
		return this;
	}
}
