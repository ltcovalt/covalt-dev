// plugins/remark-code-lang.js
import { visit } from "unist-util-visit";

/**
 * gets the language property from the markdown code fence 
 * and makes it available in the HTML AST for use by rehype
 */
export default function remarkCodeLang() {
	return (tree) => {
		visit(tree, "code", (node) => {
			if (!node.lang) return;
			node.data ||= {};
			node.data.hProperties ||= {};
			node.data.hProperties["data-language"] = node.lang;
		});
	};
}
