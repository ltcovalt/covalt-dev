const Tree = {};
(() => {
	/**
	 * returns the root node of a given node
	 * @param {object} params - named function parameters
	 * @param {GlideRecord} params.node - the current node being processed
	 * @param {string} [params.parentField=parent] - name of the parent reference field
	 */
	Tree.getRootNode = ({ node, parentField = 'parent', stackPath = [] }) => {
		if (!node) throw Error('missing required parameter: node');
		if (!node.isValidRecord()) throw Error('node parameter must be a valid GlideRecord');

		// ensure the current node is not already in the path
		let nodeId = node.getUniqueValue();
		if (stackPath.includes(nodeId)) throw Error('recursive reference found in path: ' + stackPath.concat(nodeId).join('-->'));
		stackPath.push(nodeId);

		// no more parent fields, return the root node
		if (!node[parentField]) return node;

		// get the parent node, then call the function again using the parent node
		let parentNode = node[parentField].getRefRecord();
		return Tree.getRootNode({ node: parentNode, parentField, stackPath });
	};
})();