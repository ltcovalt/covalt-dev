/**
 * @typedef {object} QueryParams - JSON Payload carried in 'sysparm_params' that define the query
 * @property {string} table - table name to query
 * @property {string} query - encoded query string
 * @property {string[]} columns - array of column names to retrieve values for
 * @property {number} [limit] - number of rows to return
 * @property {string} [orderBy] - column name to sort records by in ascending order
 * @property {string} [orderByDesc] - column name to sort records by in descending order
 */

/**
 * Namespace defining server-side methods exposed by the QueryAjax GlideAjax class.
 * Executes secure GlideRecordSecure queries under the current user context.
 * @namespace
 */
const QueryAjaxAPI = {
	/** Defines the type name for the class */
	type: 'QueryAjax',

	/**
	 * Executes a query for records matching the encoded query. Provides a simple
	 * interface for clients to query arbitrary records from the server, while
	 * ensuring access policy and permissions are applied.
	 *
	 * @param {QueryParams} params - JSON payload carried in 'sysparm_params' that define the query.<br />
	 * Object shape: `{ table, query, columns, limit?, orderBy?, orderByDesc? }` <br />
	 * See {@link QueryParams} interface for details.
	 *
	 * @returns {string} JSON string containing the queried records
	 *
	 * @example
	 * let params = {
	 *   table: 'sys_user',
	 *   query: 'active=true^manager!=null',
	 *   columns: ['user_name', 'manager.user_name'],
	 * };
	 *
	 * let ga = new GlideAjax('QueryAjax');
	 * ga.addParam('sysparm_name', 'records');
	 * ga.addParam('sysparm_params', JSON.stringify(params));
	 * ga.getXMLAnswer((result) => {
	 *   console.log(result);
	 * });
	 *
	 * // OUTPUT:
	 * // {
	 * //   "table": "sys_user",
	 * //   "query": "active=true^manager!=null",
	 * //   "status": "success",
	 * //   "records": [
	 * //     {
	 * //       "user_name": "melinda.carleton",
	 * //       "manager": {
	 * //         "user_name": "lucius.bagnoli"
	 * //     }
	 * //   ]
	 * // }
	 */
	records() {
		let params = this.getParameter('sysparm_params');
		try {
			params = JSON.parse(params);
		} catch (ex) {
			return JSON.stringify({
				status: 'fail',
				message: 'invalid JSON payload',
			});
		}

		let result = Query.records(params);
		return JSON.stringify(result);
	},
};

/**
 * @internal
 */
const QueryAjax = Class.create();
QueryAjax.prototype = Object.extendsObject(global.AbstractAjaxProcessor, QueryAjaxAPI);
