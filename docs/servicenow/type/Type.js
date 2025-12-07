/**
 * server-side namespace containing type checking utilities
 * @namespace
 */
const Type = {
	/**
	 * Performs a typeof check on a value and retrieves additional
	 * contextual information based on the type being checked.
	 * Examples, number (NaN), number (Integer), object (GlideRecord)
	 *
	 * @param {string} value - the value to be type checked
	 * @returns {string} returns detailed type and typeof output as a string
	 */
	detail(value) {
		const handlerMap = {
			Number: (v) => Type.getNumberType(v),
			JavaObject: (v) => Type.getJavaObjectName(v),
		};

		let primType = typeof value;
		let tag = Object.prototype.toString.call(value).slice(8, -1);
		let handler = handlerMap[tag];
		let objType = handler ? handler(value) : tag;
		return `${primType} (${objType})`;
	},

	/**
	 * Checks if a value is a string
	 * @param {any} value
	 * @returns {boolean}
	 */
	isString(value) {
		return typeof value === 'string';
	},

	/**
	 * Checks if a value is a number
	 * @param {any} value
	 * @returns {boolean}
	 */
	isNumber(value) {
		return typeof value === 'number';
	},

	/**
	 * Checks if a value is a bigint
	 * @param {any} value
	 * @returns {boolean}
	 */
	isBigint(value) {
		return typeof value === 'bigint';
	},

	/**
	 * Checks if a value is a boolean
	 * @param {any} value
	 * @returns {boolean}
	 */
	isBoolean(value) {
		return typeof value === 'boolean';
	},

	/**
	 * Checks if a value is undefined
	 * @param {any} value
	 * @returns {boolean}
	 */
	isUndefined(value) {
		return typeof value === 'undefined';
	},

	/**
	 * Checks if a value is a symbol
	 * @param {any} value
	 * @returns {boolean}
	 */
	isSymbol(value) {
		return typeof value === 'symbol';
	},

	/**
	 * Checks if a value is a function
	 * @param {any} value
	 * @returns {boolean}
	 */
	isFunction(value) {
		return typeof value === 'function';
	},

	/**
	 * Checks if a value is an object
	 * @param {any} value
	 * @returns {boolean}
	 */
	isObject(value) {
		return typeof value === 'object';
	},

	/**
	 * Checks if a value is null
	 * @param {any} value
	 * @returns {boolean}
	 */
	isNull(value) {
		return value === null;
	},

	/**
	 * Checks if a value is an integer
	 * @param {any} value
	 * @returns {boolean}
	 */
	isInteger(value) {
		return Type.getNumberType(value) === 'Integer';
	},

	/**
	 * Checks if a value is a float/decimal
	 * @param {any} value
	 * @returns {boolean}
	 */
	isFloat(value) {
		return Type.getNumberType(value) === 'Float';
	},

	/**
	 * Checks if a value is a Not a Number (NaN)
	 * @param {any} value
	 * @returns {boolean}
	 */
	isNaN(value) {
		return Type.getNumberType(value) === 'NaN';
	},

	/**
	 * Checks if a value is a finite number
	 * @param {any} value
	 * @returns {boolean}
	 */
	isFinite(value) {
		return Number.isFinite(value);
	},

	/**
	 * Checks if a value is a infinite
	 * @param {any} value
	 * @returns {boolean}
	 */
	isInfinite(value) {
		return !Number.isFinite(value);
	},

	/**
	 * Determines if a number is an integer, float, NaN, or Infinity
	 * @param {number} value - the value to be checked
	 * @returns {string} string identifying the type of number
	 */
	getNumberType(value) {
		if (typeof value !== 'number') throw TypeError('value must be a number');
		if (Number.isInteger(value)) return 'Integer';
		if (Number.isFinite(value)) return 'Float';
		if (Number.isNaN(value)) return 'NaN';
		if (!Number.isFinite(value)) return 'Infinity';
		return 'Number';
	},

	/**
	 * Checks if a value is a plain, vanilla JS object
	 * @param {*} value - the value to be checked
	 * @returns {boolean} true if the value is a plain object
	 */
	isPlainObject(value) {
		if (!value) return false;
		if (Type.detail(value) !== 'object (Object)') return false;

		let prototype = Object.getPrototypeOf(value);
		if (!prototype || prototype === Object.prototype) return false;
		return true;
	},

	/**
	 * Get the @@toStringTag (formerly internal [[class]]) for a value
	 * @param {*} value - value to retrieve the tag for
	 * @returns {string} the class/object type portion of the tag (i.e., return 'Date' for [object Date]);
	 */
	getToStringTag(value) {
		return Object.prototype.toString.call(value).slice(8, -1);
	},

	/**
	 * Attempts to identify the specific Glide class an object is an instance of
	 *
	 * Most GlideClasses are of type [object JavaObject]
	 * @param {JavaObject} obj - JavaObject, typically a Glide class, to be type checked
	 */
	getJavaObjectName(obj) {
		let typeTag = Type.getToStringTag(obj);
		if (!obj || typeTag === 'JavaObject') throw TypeErorr('obj must be a JavaObject');
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
			if (obj instanceof GlideDate) return 'GlideDate';
			if (obj instanceof GlideDateTime) return 'GlideDateTime';
			if (obj instanceof GlideDuration) return 'GlideDuration';
			if (obj instanceof GlideSchedule) return 'GlideSchedule';
			if (obj instanceof GlideSession) return 'GlideSession';
			if (obj instanceof GlideUser) return 'GlideUser';
		} catch (ex) {
			return typeTag;
		}
		return typeTag;
	},
};
