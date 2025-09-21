// Convert Markdown links to <Link> while ignoring raw <a> in MDX
import { visit } from 'unist-util-visit';

export default function remarkLinkToComponent(opts = {}) {
	const importPath = opts.importPath || '@components/Link.astro';
	const onlyExternal = opts.onlyExternal === true;
	const addExternalTarget = opts.addExternalTarget === true;

	return function transformer(tree) {
		let changed = false;

		// Collect [id]: url definitions for linkReference nodes
		const defs = new Map();
		visit(tree, 'definition', (def) => {
			defs.set(String(def.identifier).toLowerCase(), { url: def.url || '', title: def.title });
		});

		visit(tree, ['link', 'linkReference'], (node, index, parent) => {
			if (!parent) return;

			// Resolve url/title for both node types
			let url = '';
			let title;
			if (node.type === 'link') {
				url = node.url || '';
				title = node.title;
			} else {
				const def = defs.get(String(node.identifier).toLowerCase());
				if (!def) return; // unresolved reference
				url = def.url || '';
				title = def.title;
			}
			if (!url) return;
			if (onlyExternal && !/^https?:\/\//i.test(url)) return;

			const attrs = [{ type: 'mdxJsxAttribute', name: 'href', value: url }];
			if (title) attrs.push({ type: 'mdxJsxAttribute', name: 'title', value: title });

			if (addExternalTarget && /^https?:\/\//i.test(url)) {
				attrs.push({ type: 'mdxJsxAttribute', name: 'target', value: '_blank' });
				attrs.push({ type: 'mdxJsxAttribute', name: 'rel', value: 'noopener noreferrer' });
			}

			parent.children[index] = {
				type: 'mdxJsxTextElement', // requires @astrojs/mdx / remark-mdx in the pipeline
				name: 'Link',
				attributes: attrs,
				children: node.children || []
			};
			changed = true;
		});
	};
}
