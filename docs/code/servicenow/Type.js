/**
 * server-side namespace containing type checking utilities
 */
const Type = {};
(() => {
	/**
	 * Performs a typeof check on a value and retrieves additional
	 * contextual information based on the type being checked.
	 * Examples, number (NaN), number (Integer), object (GlideRecord)
	 *
	 * @param {string} v - the value to be type checked
	 * @returns {string} returns detailed type and typeof output as a string
	 */
	Type.detail = (v) => {
		const handlerMap = {
			Number: (v) => Type.getNumberType(v),
			JavaObject: (v) => Type.getJavaObjectName(v),
		};

		let primType = typeof v;
		let tag = Object.prototype.toString.call(v).slice(8, -1);
		let handler = handlerMap[tag];
		let objType = handler ? handler(v) : tag;
		return `${primType} (${objType})`;
	};

	/*
	 * primitive type checks
	 */
	Type.isString = (v) => typeof v === 'string';
	Type.isNumber = (v) => typeof v === 'number';
	Type.isBigint = (v) => typeof v === 'bigint';
	Type.isBoolean = (v) => typeof v === 'boolean';
	Type.isUndefined = (v) => typeof v === 'undefined';
	Type.isSymbol = (v) => typeof v === 'symbol';
	Type.isFunction = (v) => typeof v === 'function';
	Type.isObject = (v) => typeof v === 'object';
	Type.isNull = (v) => v === null;

	/*
	 * number type checks
	 */
	Type.isInteger = (v) => Type.getNumberType(v) === 'Integer';
	Type.isFloat = (v) => Type.getNumberType(v) === 'Float';
	Type.isNaN = (v) => Type.getNumberType(v) === 'NaN';
	Type.isFinite = (v) => Number.isFinite(v);
	Type.isInfinite = (v) => !Number.isFinite(v);

	/**
	 * Determines if a number is an integer, float, NaN, or Infinity
	 * @param {number} v - the value to be checked
	 * @returns {string} string identifying the type of number
	 */
	Type.getNumberType = (v) => {
		if (typeof v !== 'number') throw TypeError('value must be a number');
		if (Number.isInteger(v)) return 'Integer';
		if (Number.isFinite(v)) return 'Float';
		if (Number.isNaN(v)) return 'NaN';
		if (!Number.isFinite(v)) return 'Infinity';
		return 'Number';
	};

	/**
	 * Checks if a value is a plain, vanilla JS object
	 * @param {*} v - the value to be checked
	 * @returns {boolean} true if the value is a plain object
	 */
	Type.isPlainObject = (v) => {
		if (!v) return false;
		if (Type.detail(v) !== 'object (Object)') return false;

		let prototype = Object.getPrototypeOf(v);
		if (!prototype || prototype === Object.prototype) return false;
		return true;
	};

	/**
	 * Get the @@toStringTag (formerly internal [[class]]) for a value
	 * @param {*} v - value to retrieve the tag for
	 * @returns {string} the class/object type portion of the tag (i.e., return 'Date' for [object Date]);
	 */
	Type.getToStringTag = (v) => {
		return Object.prototype.toString.call(v).slice(8, -1);
	};

	/**
	 * Attempts to identify the specific Glide class an object is an instance of
	 *
	 * Most GlideClasses are of type [object JavaObject]
	 * @param {JavaObject} obj -
	 */
	Type.getJavaObjectName = (obj) => {
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
	};
})();
