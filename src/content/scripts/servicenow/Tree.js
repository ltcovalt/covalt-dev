/**
 * namespace containing tree traversal functions
 * @namespace
 */
const Tree = {};
(() => {
	/**
	 * returns the root node of a given node
	 * @param {object} params - named function parameters
	 * @param {GlideRecord} params.node - the current node being processed
	 * @param {string} [params.parentField=parent] - name of the parent reference field
	 * @returns {GlideRecord} the root node of the tree
	 */
	Tree.getRootNode = (params) => Tree.walkToRoot(params);

	/**
	 * visits each node in a tree structure, starting from the given node and moving up to the root node
	 * @param {object} params - named function parameters
	 * @param {GlideRecord} params.node - the current node being processed
	 * @param {string} [params.parentField=parent] - name of the parent reference field
	 * @param {function} params.callback - function to call for each node visited
	 * @param {array} [params.stackPath=[]] - array of node sys_ids representing the current path of nodes already visited
	 * @returns {GlideRecord} the root node of the tree
	 */
	Tree.walkToRoot = ({ node, parentField = 'parent', stackPath = [], callback }) => {
		if (!node) throw Error('missing required parameter: node');
		if (!node.isValidRecord()) throw Error('node parameter must be a valid GlideRecord');

		// ensure the current node is not already in the path
		let nodeId = node.getUniqueValue();
		if (stackPath.includes(nodeId)) throw Error('recursive reference found in path: ' + stackPath.concat(nodeId).join('-->'));
		stackPath.push(nodeId);

		// execute the callback function for the current node
		if (callback && typeof callback === 'function') callback(node);

		// no more parent fields, return the root node
		if (!node[parentField]) return node;

		// get the parent node, then call the function again using the parent node
		let parentNode = node[parentField].getRefRecord();
		return Tree.walkToRoot({ node: parentNode, parentField, stackPath, callback });
	};
})();