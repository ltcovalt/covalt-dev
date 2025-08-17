import { visit } from "unist-util-visit";
export default function remarkCodeLang() {
	return (tree) => {
		visit(tree, "code", (n) => {
			if (!n.lang) return;
			n.data ??= {};
			n.data.hProperties ??= {};
			if (n.data.hProperties["data-language"] == null) {
				n.data.hProperties["data-language"] = n.lang; // -> <pre data-language="...">
			}
		});
	};
}