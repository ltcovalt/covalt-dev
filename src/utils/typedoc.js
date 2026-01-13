/**
 * TypeDoc parsing and manipulation helper functions
 */
import { parseHTML } from 'linkedom';

/**
 * Extracts typedoc generated breadcrumbs
 */
export function extractBreadcrumbs(html) {
	const { document } = parseHTML(html);
	const body = document.body ?? document;
	const firstHeading = body.querySelector('h1');

	if (!firstHeading) return { html: body.innerHTML, breadcrumbsHtml: null };

	const prev = firstHeading.previousElementSibling;
	if (!isBreadcrumbParagraph(prev)) return { html: body.innerHTML, breadcrumbsHtml: null };

	const breadcrumbsHtml = prev.outerHTML;
	prev.remove();

	return { html: body.innerHTML, breadcrumbsHtml };
}

/**
 * Check if a <p> element contains TypeDoc generated breadcrumb content
 * @param {string} p - html content to be checked, typically a <p> element
 * @returns {boolean} returns true if the element is TypeDoc breadcrumbs
 */
function isBreadcrumbParagraph(p) {
	if (!p || p.tagName !== 'P') return false;

	const links = p.querySelectorAll(':scope > a');
	if (links.length < 1) return false;

	const text = (p.textContent || '').trim();

	// Require at least one separator in the full text
	if (!/[\/›»]/.test(text)) return false;

	// Remove the text contributed by links, then remove whitespace
	const linkText = Array.from(links)
		.map((a) => (a.textContent || '').trim())
		.join('');

	const leftover = text.replace(linkText, '').replace(/\s+/g, '');

	// Now leftover should be: separators + optional final segment
	// Allow common "word" chars for the final crumb (supports long API names)
	return /^[\/›»]+[A-Za-z0-9_.:-]*$/.test(leftover);
}
