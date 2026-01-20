/**
 * Server-side namespace containing methods to execute secure `GlideRecordSecure` queries,
 * returning a plain, sanitized JavaScript object containing only the requested columns and values.
 * @namespace
 */
const Query = {
	/**
	 * Executes a GlideRecord query and returns an array of objects containing only
	 * the requested columns. Can also be used to retrieve dotwalked values.
	 *
	 * @param {object} params - object containing parameters used by the Query API
	 * @param {string} params.table - table name to query
	 * @param {string} params.query - encoded query
	 * @param {string[]} params.columns - array of column names to be included in the query
	 * @param {number} [params.limit=100] - number of records to return, default is 100
	 * @param {string} [params.orderBy] - column used to sort results in ascending order
	 * @param {string} [params.orderByDesc] - column used to sort results in descending order
	 * @returns {object} result object containing records and related metadata
	 *
	 * @example
	 * let result = Query.records({
	 *   table: 'sys_user',
	 *   query: 'active=true^manager!=null',
	 *   columns: ['user_name', 'manager.user_name'],
	 *   limit: 1
	 * });
	 * gs.info(JSON.stringify(result, null, 2));
	 *
	 * // OUTPUT
	 * // {
	 * //   "table": "sys_user",
	 * //   "query": "active=true^manager!=null",
	 * //   "records": [
	 * //     {
	 * //       "user_name": "melinda.carleton",
	 * //       "manager": {
	 * //         "user_name": "lucius.bagnoli"
	 * //       }
	 * //     }
	 * //   ]
	 * // }
	 */
	records({ table, query, columns, limit, orderBy, orderByDesc }) {
		const DEFAULT_ROWS = 100;
		const MAX_ROWS = 1000;
		const MAX_COLS = 20;
		const MAX_DOTWALK_DEPTH = 2;

		limit = limit ?? DEFAULT_ROWS;

		// prettier-ignore
		let validation = 
			Check({table}).is.string().is.validTable()
			.check({query}).is.string()
			.check({columns}).is.array().has.lengthBetween(1, MAX_COLS)
			.check({limit}).is.a.number().between(0, MAX_ROWS)
			.check({orderBy}).is.an.optional().string().is.oneOf(columns)
			.check({orderByDesc}).optional().string().is.oneOf(columns)
			.result();
		if (!validation.ok) {
			return {
				status: 'fail',
				data: validation.errors,
			};
		}

		let records = [];
		let gr = new GlideRecordSecure(table);
		if (limit) gr.setLimit(limit);
		if (orderBy) gr.orderBy(orderBy);
		if (orderByDesc) gr.orderByDesc(orderByDesc);
		gr.addEncodedQuery(query);
		gr.query();
		while (gr.next()) {
			let record = {};

			for (let element of columns) {
				let gElement = gr.getElement(element);
				if (!gElement) continue;
				let value = gElement.getValue() ?? null;
				let current = record;

				// split dotwalked elements and add them to the returned object
				let parts = element.split('.');
				for (let i = 0; i < parts.length; i++) {
					let key = parts[i];
					let dotwalkPath = parts.slice(0, i + 1);
					// set value for the final dotwalk segment
					if (i === parts.length - 1) {
						if (current[key] && typeof current[key] === 'object') {
							return {
								status: 'fail',
								data: {
									[element]: `Column collision occurred - "${element}" attempts to assign a scalar value to an object created by another dotwalked column. To fix, request ${dotwalkPath}.sys_id directly and remove the conflicting column.`,
								},
							};
						}
						current[key] = value;
					} else {
						// ensure intermediate objects exist for the dotwalk path
						if (current[key] != null && typeof current[key] !== 'object') {
							return {
								status: 'fail',
								data: {
									[element]: `Column collision occurred - "${element}" attempted to dotwalk through ${dotwalkPath}, but the path was previously assigned a scalar value by another column. To fix, request ${dotwalkPath}.sys_id directly and remove the conflicting column.`,
								},
							};
						}
						if (!current[key]) current[key] = {};
						current = current[key];
					}
				}
			}
			records.push(record);
		}

		return {
			status: 'success',
			data: records.length > 0 ? records : null,
		};
	},
};
