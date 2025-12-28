/**
 * Server-side namespace for performing arbitrary GlideRecordSecure queries.
 * Should not typically be invoked directly. This script primarily exists to
 * adapt queries from the QueryAjax utility to a standard GlideRecordSecure query,
 * allowing clients to retrieve server data without bespoke AJAX script includes.
 * Records are returned as plain JavaScript objects containing only the specified fields.
 * @namespace
 */
const Query = {
	/**
	 * @param {object} params - object containing parameters used by the Query API
	 * @param {string} params.table - table name to query
	 * @param {string} params.query - encoded query
	 * @param {string[]} params.columns - array of column names to be included in the query
	 * @param {number} [params.limit=0] - number of records to return, default returns all
	 * @param {string} [params.orderBy] - column used to sort results in ascending order
	 * @param {string} [params.orderByDesc] - column used to sort results in descending order
	 * @returns {object} -
	 */
	record({ table, query, columns, limit, orderBy, orderByDesc }) {
		const DEFAULT_ROWS = 100;
		const MAX_ROWS = 1000;
		const MAX_COLS = 20;
		const MAX_DOTWALK_DEPTH = 2;

		limit = limit ?? MAX_ROWS;

		// prettier-ignore
		let validation = 
			Check({table}).is.string().is.validTable()
			.check({query}).is.string()
			.check({columns}).is.array().has.minLength(1)
			.check({limit}).is.a.number().between(0, MAX_ROWS)
			.check({orderBy}).is.an.optional.string().is.oneOf(columns)
			.check({orderByDesc}).optional.string().is.oneOf(columns)
			.result();
		if (!validation.ok) throw TypeError(validation.errors.join('\n'));

		let result = { table, query, columns, status: 'success', records: [] };
		let gr = new GlideRecordSecure(table);
		if (limit) gr.setLimit(limit);
		if (orderBy) gr.orderBy(orderBy);
		if (orderByDesc === 'DESC') gr.orderByDesc(orderByDesd);
		gr.addEncodedQuery(query);
		gr.query();
		while (gr.next()) {
			let record = {};
			for (let col of columns) {
				let value = gr.getElement(col).getValue();
				record[col] = value;
			}
			result.records.push(record);
		}
		return result;
	},
};
