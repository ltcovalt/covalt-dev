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
	 * @param {string} v - the value to be type checked
	 * @returns {string} returns detailed type and typeof output as a string
	 */
	detail(v) {
		const handlerMap = {
			Number: (v) => Type.getNumberType(v),
			JavaObject: (v) => Type.getJavaObjectName(v),
		};

		let primType = typeof v;
		let tag = Object.prototype.toString.call(v).slice(8, -1);
		let handler = handlerMap[tag];
		let objType = handler ? handler(v) : tag;
		return `${primType} (${objType})`;
	},

	/*
	 * primitive type checks
	 */
	isString(v) {
		return typeof v === 'string';
	},
	isNumber(v) {
		return typeof v === 'number';
	},
	isBigint(v) {
		return typeof v === 'bigint';
	},
	isBoolean(v) {
		return typeof v === 'boolean';
	},
	isUndefined(v) {
		return typeof v === 'undefined';
	},
	isSymbol(v) {
		return typeof v === 'symbol';
	},
	isFunction(v) {
		return typeof v === 'function';
	},
	isObject(v) {
		return typeof v === 'object';
	},
	isNull(v) {
		return v === null;
	},

	/*
	 * number type checks
	 */
	isInteger(v) {
		return Type.getNumberType(v) === 'Integer';
	},
	isFloat(v) {
		return Type.getNumberType(v) === 'Float';
	},
	isNaN(v) {
		return Type.getNumberType(v) === 'NaN';
	},
	isFinite(v) {
		return Number.isFinite(v);
	},
	isInfinite(v) {
		return !Number.isFinite(v);
	},

	/**
	 * Determines if a number is an integer, float, NaN, or Infinity
	 * @param {number} v - the value to be checked
	 * @returns {string} string identifying the type of number
	 */
	getNumberType(v) {
		if (typeof v !== 'number') throw TypeError('value must be a number');
		if (Number.isInteger(v)) return 'Integer';
		if (Number.isFinite(v)) return 'Float';
		if (Number.isNaN(v)) return 'NaN';
		if (!Number.isFinite(v)) return 'Infinity';
		return 'Number';
	},

	/**
	 * Checks if a value is a plain, vanilla JS object
	 * @param {*} v - the value to be checked
	 * @returns {boolean} true if the value is a plain object
	 */
	isPlainObject(v) {
		if (!v) return false;
		if (Type.detail(v) !== 'object (Object)') return false;

		let prototype = Object.getPrototypeOf(v);
		if (!prototype || prototype === Object.prototype) return false;
		return true;
	},

	/**
	 * Get the @@toStringTag (formerly internal [[class]]) for a value
	 * @param {*} v - value to retrieve the tag for
	 * @returns {string} the class/object type portion of the tag (i.e., return 'Date' for [object Date]);
	 */
	getToStringTag(v) {
		return Object.prototype.toString.call(v).slice(8, -1);
	},

	/**
	 * Attempts to identify the specific Glide class an object is an instance of
	 *
	 * Most GlideClasses are of type [object JavaObject]
	 * @param {JavaObject} obj - JavaObject, typically a Glide class, to be type checks
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
