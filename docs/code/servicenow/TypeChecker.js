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
		this.messages = [];
		this.invert = false;
	}

	// NOTE: modifiers

	get not() {
		this.invert = !this.invert;
		return this;
	}

	// TODO: is/has getters are just noop passthroughs at the moment
	// should add only the specific methods that should be available for each

	get is() {
		return this;
	}

	get has() {
		return this;
	}

	// NOTE: core predicate functions

	type(expected) {
		let actual = typeof this.value;
		let prefix = this.invert ? "NOT " : "";
		let message = `expected typeof ${prefix}${expected}, received ${actual}`;
		this.assert(expected === actual, message);
		return this;
	}

	// NOTE: terminal methods

	/**
	 * @returns {boolean} returns true if there were no type errors
	 */
	ok() {
		return this.messages.length === 0;
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
			errors: [...this.messages],
		};
	}

	/**
	 * checks the current validation status and throws a TypeError if not ok
	 * @returns {this} the current TypeChecker instance
	 */
	guard() {
		if (!this.ok()) {
			throw TypeError(this.messages.join("\n"));
		}
		return this;
	}

	// NOTE: core assertion

	assert(pass, message) {
		pass = this.invert ? !pass : pass;
		if (!pass) {
			this.messages.push(message);
		}
		// reset the result inversion flag
		this.invert = false;
		return this;
	}
}
