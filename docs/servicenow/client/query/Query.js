/**
 * Client-side namespace for performing arbitrary GlideRecordSecure queries
 * without needing a bespoke AJAX script include for each query. The client-side
 * Query namespace is a wrapper around the QueryAjax utility to improve ease of use
 * by reducing boilerplate, performing response parsing, and error handling.
 * @namespace
 */
const Query = {
	records(params, callback) {
		if (typeof params !== 'object') throw TypeError('params must be an object');
		if (callback && callback !== 'function') throw TypeError('callback parameter must be a function');

		let ga = new GlideAjax('QueryAjax');
		ga.addParam('sysparm_name', 'records');
		ga.addParam('sysparm_params', JSON.stringify(params));
		if (callback) {
			ga.getXMLAnswer((res) => {
				callback(res);
			});
			return;
		} else {
			ga.getXMLWait();
			let res = ga.getAnswer();
		}
	},
};
