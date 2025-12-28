/**
 * Strips a leading "prettier-ignore" comment from fenced code blocks.
 * Does not impact imported source files, only inline code fences.
 */
import { visit } from 'unist-util-visit';

const patterns = [
	/^\s*\/\/\s*prettier-ignore(?:-start|-end)?\b/i, // JS/TS single line comment
	/^\s*\/\*\s*prettier-ignore(?:-start|-end)?\s*\*\/\s*$/i, // JS/TS block comment
	/^\s*<!--\s*prettier-ignore(?:-start|-end)?\s*-->\s*$/i, // HTML block comment
];

export default function remarkCodeStripPrettierIgnore() {
	return (tree) => {
		visit(tree, 'code', (node) => {
			if (node.meta?.includes('file=')) return; // don't process imported source
			if (!node || typeof node.value !== 'string') return;
			const lines = node.value.split('\n');

			// remove a single leading ignore line and an optional following blank line
			if (lines[0] && patterns.some((re) => re.test(lines[0]))) {
				lines.shift();
				if (lines[0] && /^\s*$/.test(lines[0])) lines.shift();
				node.value = lines.join('\n');
			}
		});
	};
}
