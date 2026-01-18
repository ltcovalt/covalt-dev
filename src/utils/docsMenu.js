/**
 * @typedef {Object} MenuNode
 * @property {string} label
 * @property {string} [href]
 * @property {MenuNode[]} [children]
 */

/**
 * Generates a hierarchical tree menu from an Astro collection.
 * Returns an array of MenuNode objects
 * @param {Array} entries - an Astro content collection
 * @returns {MenuNode[]}
 */
export function buildMenu(entries) {
	const platforms = new Map();

	const titleCase = (value) =>
		value
			.split(/\s+/)
			.map((part) => (part ? part[0].toUpperCase() + part.slice(1) : ''))
			.join(' ');

	for (const entry of entries) {
		const id = entry.id;
		const href = `/docs/${id.replace('/source', '')}`;
		const { api, platform, runtime } = entry.data.env;

		// Update platforms Map with runtimes
		let runtimeMap = platforms.get(platform);
		if (!runtimeMap) {
			runtimeMap = new Map();
			platforms.set(platform, runtimeMap);
		}

		// Update runtimes Map with leaf items
		let items = runtimeMap.get(runtime);
		if (!items) {
			items = [];
			runtimeMap.set(runtime, items);
		}

		// push the leaf nodes to the runtime
		items.push({ label: api, href });
	}

	/**
	 * Generate the menu item array from the Platform/Runtime Maps
	 */

	/** @type {MenuNode[]} */
	const menu = [];
	for (const [platform, runtimeMap] of platforms) {
		/** @type {MenuNode} */
		const platformNode = { label: platform, children: [] };

		const runtimeEntries = Array.from(runtimeMap.entries());
		runtimeEntries.sort(([a], [b]) => a.localeCompare(b));

		for (const [runtime, items] of runtimeEntries) {
			items.sort((a, b) => a.label.localeCompare(b.label));

			const runtimeNode = {
				label: titleCase(runtime),
				children: items.map((item) => ({
					label: item.label,
					href: item.href,
				})),
			};

			platformNode.children.push(runtimeNode);
		}

		menu.push(platformNode);
	}

	menu.sort((a, b) => a.label.localeCompare(b.label));
	return menu;
}
