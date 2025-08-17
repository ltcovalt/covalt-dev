// plugins/rehype-code-header.js
import { visit } from 'unist-util-visit';

export default function rehypeCodeHeader() {
	return (tree) => {
		visit(tree, 'element', (node) => {
			if (node.tagName !== 'pre') return;
			if (!node.children?.some((c) => c.tagName === 'code')) return;

			const props = (node.properties ??= {});
			if (props['data-has-header']) return;

			// prefer remark-added data-language, else fallback to 'text'
			const lang = props['data-language'] ?? props.dataLanguage ?? 'text';

			node.children.unshift({
				type: 'element',
				tagName: 'div',
				properties: {
					className: ['code-header', 'flex', 'items-center'],
					style: 'position: relative;',
				},
				children: [
					{
						type: 'element',
						tagName: 'span',
						properties: {
							className: ['code-label', 'text-xs', 'text-gray-500', 'mr-2'],
						},
						children: [{ type: 'text', value: lang }],
					},
					{
						type: 'element',
						tagName: 'button',
						properties: {
							className: ['btn', 'btn-soft', 'btn-xs', 'ml-auto', 'code-copy'],
							type: 'button',
							'aria-label': 'Copy code',
						},
						children: [{ type: 'text', value: 'Copy' }],
					},
				],
			});

			props['data-has-header'] = '1'; // mark as processed
		});
	};
}
