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
	 * performs a typeof check on a value and retrieves additional
	 * contextual information based on the type being checked.
	 * Examples, NaN (number), Infinity (number), GlideRecord (object)
	 *
	 * @param {string} val - the value to be type checked
	 * @returns {string} returns detailed type and typeof output as a string
	 */
	Type.detail = (val) => {
		const handlerMap = {
			Number: (val) => Type.getNumberType(val),
			JavaObject: (val) => Type.getJavaObjectName(val),
		};

		let primType = typeof val;
		let tag = Object.prototype.toString.call(val).slice(8, -1);
		let handler = handlerMap[tag];
		let objType = handler ? handler(val) : tag;
		return `${primType} (${objType})`;
	};

	Type.getNumberType = (val) => {
		if (typeof val !== "number") throw TypeError("value must be a number");
		if (Number.isInteger(val)) return "Integer";
		if (Number.isFinite(val)) return "Float";
		if (Number.isNaN(val)) return "NaN";
		if (!Number.isFinite(val)) return "Infinity";
		return "Number";
	};

	Type.getJavaObjectName = (val) => {
		/**
		 * NOTE: Only a limited subset of Glide classes return a useful
		 * prototype name, some are listed below, but most return "JavaObject"
		 * so we have to explicitly check using instanceof
		 *
		 * GlideRecord
		 * GlideRecordSecure
		 * GlideScopedEvaluator
		 * GlideFilter
		 */

		// NOTE: instanceof can throw if the right side of the comparison
		// is null or undefined and can be especially inconsistent in scoped apps
		try {
			if (val instanceof GlideDate) return "GlideDate";
			if (val instanceof GlideDateTime) return "GlideDateTime";
			if (val instanceof GlideDuration) return "GlideDuration";
			if (val instanceof GlideSchedule) return "GlideSchedule";
			if (val instanceof GlideSession) return "GlideSession";
			if (val instanceof GlideUser) return "GlideUser";
		} catch (ex) {
			// intentionally empty, will default to the standard object tag
		}
	};
})();
