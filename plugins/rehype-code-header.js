import { visit } from 'unist-util-visit';

export default function rehypeCodeHeader() {
	return (tree) => {
		visit(tree, 'element', (node) => {
			if (node.tagName !== 'pre') return;

			// flag processed <pre> tags so they are never injected twice
			node.properties ||= {};
			if (node.properties['data-has-header']) return;
			node.properties['data-has-header'] = '1';

			// only operate on real code blocks
			if (!Array.isArray(node.children) || !node.children.some(c => c.tagName === 'code')) return;

			const lang = node.properties['data-language'] || 'plain';

			node.children.unshift({
				type: 'element',
				tagName: 'div',
				properties: { className: ['code-header', 'flex', 'items-center'], style: 'position: relative;' },
				children: [
					{
						type: 'element',
						tagName: 'span',
						properties: { className: ['text-xs', 'text-gray-500', 'mr-2'] },
						children: [{ type: 'text', value: lang }],
					},
					{
						type: 'element',
						tagName: 'button',
						properties: {
							className: ['btn', 'btn-soft', 'btn-xs', 'ml-auto', 'copy-code'],
							type: 'button',
							'aria-label': 'Copy code',
						},
						children: [{ type: 'text', value: 'Copy' }],
					},
				],
			});
		});
	};
}
