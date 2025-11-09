/**
 * performs runtime type validation and error handling
 */
const Check = (value, name) => {
	if (typeof value === 'object') {
		let keys = Object.keys(value);
		if (keys.length !== 1) throw Error('object must contain a single name:value pair');
		return new Checker(value[keys[0]], keys[0]);
	}
	return new Checker(value, name);
};

// prettier-ignore
const TEMPLATE_MAP = Object.freeze({
	type: (o) => `${o.name}: expected ${o.label} ${o.prefix}${o.expected}, received ${o.actual}`,
	truthy: (o) => `${o.name}: expected value to ${o.prefix}be ${o.predicate}, received ${o.actual}`,
	DEFAULT: (o) => `${o.name}: expected value to ${o.prefix}be ${o.expected}, received ${o.actual}`,
});

const PREDICATE_TEMPLATE = Object.freeze({
	type: 'type',
	typeDetail: 'type',
	truthy: 'truthy',
	falsy: 'truthy',
});

class Checker {
	/**
	 * instantiates a new TypeChecker object
	 * @param {string} name - the name or label of the value being checked
	 * @param {*} value - the value to be checked
	 */
	constructor(value, name) {
		this.value = value;
		this.name = name;
		this.invert = false;
		this.checks = [];
		this.errors = [];
		this.message;
	}

	get prefix() {
		return this.invert ? 'NOT ' : '';
	}

	get typeof() {
		return typeof this.value;
	}

	get typeofDetail() {
		return Type.detail(this.value);
	}

	// NOTE: modifiers

	get not() {
		this.invert = !this.invert;
		return this;
	}

	// TODO: passthrough getters to make API calls grammically accurate
	// consider limiting which predicates are available for each getter

	get is() {
		return this;
	}

	get are() {
		return this;
	}

	get to() {
		return this;
	}

	get be() {
		return this;
	}

	get has() {
		return this;
	}

	get have() {
		return this;
	}

	// NOTE: core type predicates

	type(expected) {
		this.evaluate(this.typeof === expected, {
			actual: this.typeof,
			predicate: 'type',
			label: 'type of',
			expected,
		});
		return this;
	}

	typeDetail(expected) {
		this.evaluate(this.typeofDetail === expected, {
			actual: this.typeofDetail,
			predicate: 'typeDetail',
			label: 'detailed type of',
			expected,
		});
		return this;
	}

	// standard type checks
	string() {
		return this.type('string');
	}
	number() {
		return this.type('number');
	}
	bigint() {
		return this.type('bigint');
	}
	boolean() {
		return this.type('boolean');
	}
	function() {
		return this.type('function');
	}
	object() {
		return this.type('object');
	}
	null() {
		return this.typeDetail('object (Null)');
	}
	undefined() {
		return this.type('undefined');
	}
	symbol() {
		return this.type('symbol');
	}

	// number type checks
	integer() {
		return this.typeDetail('number (Integer)');
	}
	float() {
		return this.typeDetail('number (Float)');
	}
	nan() {
		return this.typeDetail('number (NaN)');
	}
	infinity() {
		return this.typeDetail('number (Infinity)');
	}
	finite() {
		this.evaluate(this.typeofDetail === 'number (Integer)' || this.typeofDetail === 'number (Float)', {
			actual: this.typeofDetail,
			predicate: 'finate',
			label: 'finite number',
			expected: 'number (Integer) or number (Float)',
		});
		return this;
	}

	// truthy checks
	truthy() {
		this.evaluate(!!this.value === true, {
			actual: !!this.value,
			predicate: 'truthy',
			label: 'truthy',
			expected: 'true',
		});
		return this;
	}
	falsy() {
		this.evaluate(!!this.value === false, {
			actual: !!this.value,
			predicate: 'falsy',
			label: 'falsy',
			expected: 'false',
		});
		return this;
	}

	// complex object checks
	array() {
		return this.typeDetail('object (Array)');
	}
	regex() {
		return this.typeDetail('object (RegExp)');
	}
	date() {
		return this.typeDetail('object (Date)');
	}
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
	plainObject() {
		let prototype = Object.getPrototypeOf(this.value);
		let typeDetail = Type.detail(this.value);
		let pass = typeDetail === 'object (Object)' && (prototype === Object.prototype || prototype === null);
		// TODO: consider updating actual/expected to indicate the prototype as well,
		// as there are cases where object (Object) uses a custom class/prototype
		this.evaluate(pass, {
			actual: typeDetail,
			predicate: 'plainObject',
			label: 'plain object',
			expected: 'object (Object)',
		});
		return this;
	}

	// NOTE: equality checks

	equal(expected) {
		this.evaluate(this.value === expected, {
			actual: this.value,
			predicate: 'equals',
			label: 'equal to',
			expected,
		});
		return this;
	}

	equals(expected) {
		return this.equal(expected);
	}

	oneOf(array) {
		this.evaluate(array.indexOf(this.value) !== -1, {
			actual: this.value,
			predicate: 'oneOf',
			label: 'one of',
			expected: array,
		});
		return this;
	}
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

	positive() {
		return this.greaterThan(0);
	}
	negative() {
		return this.lessThan(0);
	}

	lessThan(expected) {
		this.evaluate(this.value < expected, {
			actual: this.value,
			predicate: 'lessThan',
			label: 'less than',
			expected,
		});
		return this;
	}
	less(expected) {
		return this.lessThan(expected);
	}

	lt(expected) {
		return this.less(expected);
	}

	lessThanOrEquals() {
		this.evaluate(this.value <= expected, {
			actual: this.value,
			predicate: 'lessThanOrEquals',
			label: 'less than or equal to',
			expected,
		});
		return this;
	}

	lessOrEquals(expected) {
		return this.lessThanOrEquals(expected);
	}

	lte(expected) {
		return lessOrEquals(expected);
	}

	greaterThan(expected) {
		this.evaluate(this.value > expected, {
			actual: this.value,
			predicate: 'greaterThan',
			label: 'greater than',
			expected,
		});
		return this;
	}

	greater(expected) {
		return this.greaterThan(expected);
	}

	gt(expected) {
		return greaterThan(expected);
	}

	greaterThanOrEquals(expected) {
		this.evaluate(this.value >= expected, {
			actual: this.value,
			predicate: 'greaterThanOrEquals',
			label: 'greater than or equal to',
			expected,
		});
		return this;
	}

	greaterOrEquals(expected) {
		return this.greaterThanOrEquals(expected);
	}

	gte(expected) {
		return greaterThanOrEquals(expected);
	}

	// NOTE: terminal operation methods

	/**
	 * @returns {boolean} returns true if there were no type errors
	 */
	ok() {
		return this.errors.length === 0;
	}

	/**
	 * returns the type validation result
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
	 * checks the current validation status and throws a TypeError if not ok
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
	 * @param {string} name - name or label of the value being checked
	 * @param {*} value - the value to be checked
	 * @returns {this} the current TypeChecker instance
	 */
	check(value, name) {
		this.value = value;
		this.name = name;
		return this;
	}
}
