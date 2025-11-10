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

	/**
	 * Determines if a number is an integer, float, NaN, or Infinity
	 * @param {number} val - the value to be checked
	 * @returns {string} string identifying the type of number
	 */
	Type.getNumberType = (val) => {
		if (typeof val !== 'number') throw TypeError('value must be a number');
		if (Number.isInteger(val)) return 'Integer';
		if (Number.isFinite(val)) return 'Float';
		if (Number.isNaN(val)) return 'NaN';
		if (!Number.isFinite(val)) return 'Infinity';
		return 'Number';
	};

	/**
	 * Checks if a value is a plain, vanilla JS object
	 * @param {*} value - the value to be checked
	 * @returns {boolean} true if the value is a plain object
	 */
	Type.isPlainObject = (value) => {
		if (!value) return false;
		if (Type.detail(value) !== 'object (Object)') return false;

		let prototype = Object.getPrototypeOf(value);
		if (!prototype || prototype === Object.prototype) return false;
		return true;
	};

	/**
	 * Get the @@toStringTag (formerly internal [[class]]) for a value
	 * @param {*} value - value to retrieve the tag for
	 * @returns {string} the class/object type portion of the tag (i.e., return 'Date' for [object Date]);
	 */
	Type.getToStringTag = (value) => {
		return Object.prototype.toString.call(val).slice(8, -1);
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
