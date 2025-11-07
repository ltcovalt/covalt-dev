/**
 * TypeChecker performs runtime type validation and error handling
 */
class TypeChecker {
	/**
	 * instantiates a new TypeChecker object
	 * @param {string} name - the name or label of the value being checked
	 * @param {*} value - the value to be checked
	 */
	constructor(name, value) {
		this.name = name;
		this.value = value;
		this.invert = false;
		this.checks = [];
		this.errors = [];
	}

	get prefix() {
		return this.invert ? "NOT " : "";
	}

	get type() {
		return typeof this.value;
	}

	// NOTE: modifiers

	get not() {
		this.invert = !this.invert;
		return this;
	}

	// TODO: getters are just noop passthroughs to make API calls grammically accurate
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

	get has() {
		return this;
	}

	get have() {
		return this;
	}

	// NOTE: core predicate functions

	type(expected) {
		let message = `${this.name}: expected typeof ${this.prefix}${expected}, received ${this.type}`;
		this.evaluate(expected === actual, {
			predicate: "type",
			expected,
			actual,
		});
		return this;
	}

	less(expected) {
		let actual = typeof this.value;
		let prefix = this.invert ? "NOT" : "";
		let message = `${this.name}: expected ${this.value} to ${prefix}be less than ${expected}`;
		this.evaluate(this.value < expected, {
			predicate: "less",
			expected,
			actual,
		});
	}

	lessOrEqual(expected) {
		let actual = typeof this.value;
		let prefix = this.invert ? "NOT" : "";
		let message = `${this.name}: expected ${this.value} to ${prefix}be less than or equal to ${expected}`;
		this.evaluate(this.value <= expected, {
			predicate: "lessOrEqual",
			expected,
			actual,
		});
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
			errors: [...this.errors],
		};
	}

	/**
	 * checks the current validation status and throws a TypeError if not ok
	 * @returns {this} the current TypeChecker instance
	 */
	guard() {
		if (!this.ok()) {
			throw TypeError(this.errors.join("\n"));
		}
		return this;
	}

	// NOTE: core methods

	/**
	 * evaluates a Type.check() call chain, finalizes pass/fail,
	 * records full check details, and logs/throws errors,
	 * and resets the inversion flag for the next check
	 */
	evaluate(pass, detail) {
		pass = this.invert ? !pass : pass;
		if (!pass) {
			this.errors.push(detail.message);
		}

		this.checks.push({
			name: this.name,
			predicate: detail.predicate,
			expected,
			actual,
			pass,
			message,
		});

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
	check(name, value) {
		this.name = name;
		this.value = value;
		return this;
	}
}
