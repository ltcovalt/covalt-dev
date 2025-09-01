// plugins/rehype-code-header.js
import { visit } from 'unist-util-visit';

/**
 * add a header section to code blocks
 */
export default function rehypeCodeHeader() {
	return (tree) => {
		visit(tree, 'element', (node, index, parent) => {
			if (!parent || node.tagName !== 'pre') return;
			if (!node.children?.some((c) => c.tagName === 'code')) return;

			const preProps = (node.properties ??= {});
			const lang = preProps['data-language'] ?? preProps.dataLanguage ?? 'text';

			const header = {
				type: 'element',
				tagName: 'div',
				properties: { className: ['code-header', 'astro-code', 'github-dark', 'flex', 'items-center', 'px-3'] },
				children: [
					{ type: 'element', tagName: 'span', properties: { className: ['text-xs', 'opacity-70', 'mr-2'] }, children: [{ type: 'text', value: lang }] },
					{ type: 'element', tagName: 'button', properties: { className: ['btn', 'btn-ghost', 'btn-xs', 'ml-auto', 'code-copy'], type: 'button', 'aria-label': 'Copy code' }, children: [{ type: 'text', value: 'Copy' }] },
				],
			};

			const wrapper = {
				type: 'element',
				tagName: 'div',
				properties: { className: ['code-block', 'rounded-md', 'overflow-hidden'] },
				children: [header, node],
			};

			parent.children.splice(index, 1, wrapper);
		});
	};
}
