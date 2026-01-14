import { parseHTML } from 'linkedom';

export function extractBreadcrumbs(html) {
	// Wrap the incoming HTML as a fragment so linkedom can't invent <head>/<body> in our serialization target
	const wrapped = `<div id="__typedoc_root__">${html}</div>`;
	const { document } = parseHTML(wrapped);

	const root = document.getElementById('__typedoc_root__');
	if (!root) return { html, breadcrumbHtml: null };

	const firstHeading = root.querySelector('h1');
	if (!firstHeading) return { html: root.innerHTML, breadcrumbHtml: null };

	// Find breadcrumbs: scan backwards over previous *elements* looking for the first breadcrumb-like <p>
	let el = firstHeading.previousElementSibling;
	while (el) {
		// stop if we hit another heading before breadcrumbs
		if (/^H[1-6]$/.test(el.tagName)) break;

		if (isBreadcrumbElement(el)) {
			const breadcrumbHtml = el.outerHTML;
			el.remove();
			return { html: root.innerHTML, breadcrumbHtml };
		}

		// If we hit a substantial block before breadcrumbs, bail (prevents false positives)
		if (el.tagName === 'HR' || el.tagName === 'UL' || el.tagName === 'OL' || el.tagName === 'TABLE') {
			break;
		}

		el = el.previousElementSibling;
	}

	return { html: root.innerHTML, breadcrumbHtml: null };
}

function isBreadcrumbElement(element) {
	if (!element || element.tagName !== 'P') return false;

	const links = element.querySelectorAll(':scope > a');
	if (links.length < 1) return false;

	const fullText = (element.textContent || '').trim();
	if (!/[\/›»]/.test(fullText)) return false;

	// Remove anchors and check the remaining separator/text
	const clone = element.cloneNode(true);
	clone.querySelectorAll('a').forEach((a) => a.remove());

	const leftover = (clone.textContent || '')
		.replace(/\u00A0/g, ' ')
		.replace(/\s+/g, '')
		.trim();

	// allow functions like records() etc.
	return /^[\/›»]+[\p{L}\p{N}_.:()-]*$/u.test(leftover);
}
