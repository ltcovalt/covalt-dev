/**
 * server-side namespace containing type checking utilities
 */
const Type = {};
(() => {
	/**
	 * checks if a value's type matches the expected type and throws a
	 * TypeError if there is a type mismatch.
	 * @param {string} name - name of the parameter being checked
	 * @param {any} value - value to be type checked
	 * @param {string} type - type name as returned
	 * @param {boolean} [silent] - if true, no exceptions will be thrown
	 * @param {string[]} [messages] - an array of error messages
	 * @returns {string[]} returns an array of messages
	 */
	Type.expect = (name, value, type, silent = false, messages = []) => {
		if (messages && !Array.isArray(messages)) {
			throw TypeError("messages must be an array");
		}
		if (typeof value !== type) {
			if (silent) {
				messages.push(`expected ${name} to be ${type}, received ${typeof value}`);
			} else {
				throw TypeError(`expected ${name} to be ${type}, received ${typeof value}`);
			}
		}

		return messages;
	};

	/**
	 *
	 */
	Type.detail = (val) => {
		let type = typeof val;
		switch (type) {
			case "number":
				if (Number.isInteger(val)) return "number (Integer)";
				if (Number.isFinite(val)) return "number (Float)";
				if (Number.isNan(val)) return "number (NaN)";
				if (val === Infinity) return "number (Infinity)";
				return type;
			case "object":
		}
		return type;
	};
})();
