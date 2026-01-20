/**
 * @typedef {object} QueryParams - parameters to define a query
 * @property {string} table - table name to query
 * @property {string} query - encoded query string
 * @property {string[]} columns - array of column names to retrieve values for
 * @property {number} [limit] - number of rows to return
 * @property {string} [orderBy] - column name to sort records by in ascending order
 * @property {string} [orderByDesc] - column name to sort records by in descending order
 */

/**
 * @typedef {'success' | 'fail' | 'error'} JsendStatus - JSEND formatted response status
 *  - `'success'` — request completed successfully
 *  - `'fail'` — an expected client-side validation error
 *  - `'error'` — unexpected server-side failure
 */

/**
 * @typedef {object} QueryResponse - response object containing requested data
 * @property {JsendStatus} status - overall status of the response
 * @property {string} [message] - message describing the response result - required when status is 'fail' or 'error'
 * @property {object} [data] - wrapper for data returned by the API call
 *  - if the call returns no data, data will be `null`
 *  - if status is 'fail', data contains info on failed validations
 *  - if status is 'error', data is omitted
 */

/**
 * Client-side namespace for performing arbitrary GlideRecordSecure queries
 * without needing a bespoke AJAX script include for each query. The client-side
 * Query namespace is a wrapper around the QueryAjax utility to improve ease of use
 * by reducing boilerplate, performing response parsing, and error handling.
 * @namespace
 */
const Query = {
	/**
	 * Executes a query for records matching an encoded query.
	 * Queries are executed under the context of the current record,
	 * ensuring standard access policies and permissions are applied.
	 *
	 * @param {QueryParams} params - parameters defining the query
	 * @param {function} [callback] - optional callback function - query is executed asynchronously if provided
	 * @returns {(QueryResponse|null)} returns the parsed JSON payload or null when ran asynchronously
	 */
	records(params, callback) {
		if (typeof params !== 'object') throw TypeError('params must be an object');
		if (callback && typeof callback !== 'function') throw TypeError('callback parameter must be a function');

		let ga = new GlideAjax('QueryAjax');
		ga.addParam('sysparm_name', 'records');
		ga.addParam('sysparm_params', JSON.stringify(params));

		if (callback) {
			// run asynchronously if a callback is given
			ga.getXMLAnswer((res) => {
				try {
					res = JSON.parse(res);
				} catch (ex) {
					res = { status: 'error', message: 'GlideQuery returned invalid JSON' };
					console.error(JSON.stringify(res, null, 2));
					return;
				}
				if (res.status !== 'success') {
					console.error(JSON.stringify(res, null, 2));
				}
				callback(res);
			});
		} else {
			// run syncrhonously and return the result if no callback is given
			ga.getXMLWait();
			let res = ga.getAnswer();
			try {
				res = JSON.parse(res);
			} catch (ex) {
				res = { status: 'error', message: 'GlideQuery returned invalid JSON' };
				console.error(JSON.stringify(res, null, 2));
				return res;
			}
			if (res.status !== 'success') {
				console.error(JSON.stringify(res, null, 2));
			}
			return res;
		}
	},
};
