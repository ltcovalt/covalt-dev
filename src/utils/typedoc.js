import { parseHTML } from 'linkedom';

/**
 * Remove leading/trailing slashes from a string.
 * @param {string} value
 * @returns {string}
 */
export function trimSlashes(value) {
	return String(value ?? '').replace(/^\/+|\/+$/g, '');
}

/**
 * Removes a leading "/docs/" prefix if present.
 * @param {string} filePath
 * @returns {string} the path with /docs/ prefix stripped, if present
 */
export function stripDocsPrefix(filePath) {
	return String(filePath ?? '').replace(/^\/docs\//, '');
}

/**
 * Given a TypeDoc on-disk path like:
 *   /docs/servicenow/server/check/typedoc/classes/Checker.md
 * returns the "root API id" like:
 *   servicenow/server/check
 *
 * @param {string} typedocDiskPath
 */
export function typedocDiskPathToRootApiId(typedocDiskPath) {
	const withoutPrefix = stripDocsPrefix(typedocDiskPath);
	return withoutPrefix.split('/typedoc/')[0];
}

/**
 * Given a TypeDoc on-disk path like:
 *   /docs/servicenow/server/check/typedoc/classes/Checker.md
 * returns the public route id like:
 *   servicenow/server/check/classes/Checker
 *
 * @param {string} typedocDiskPath
 */
export function typedocDiskPathToPublicId(typedocDiskPath) {
	return String(typedocDiskPath ?? '')
		.replace(/^\/docs\//, '')
		.replace('/typedoc/', '/')
		.replace(/\.md$/, '');
}

/**
 * From a request pathname, produce a "base url" for resolving relative links.
 * Example:
 *   /docs/servicenow/server/check/classes/Checker -> /docs/servicenow/server/check/classes
 *
 * @param {string} pathname
 */
export function pathnameToBaseUrl(pathname) {
	const normalized = String(pathname ?? '').replace(/\/+$/, '');
	return normalized.replace(/\/[^/]*$/, '');
}

/**
 * Rewrite TypeDoc-generated relative links so they match Astro routes.
 * - Does NOT touch: absolute (/) links, hashes (#), or http(s).
 * - Optionally strips a trailing ".md" from targets (to match extensionless routes).
 *
 * @param {string} html
 * @param {string} baseUrl
 * @param {{ stripMdExt?: boolean }} [opts]
 */
export function rewriteRelativeLinks(html, baseUrl, opts = {}) {
	const { stripMdExt = false } = opts;

	// keep regex form consistent across files; avoids VSCode/NeoVim highlighting quirks
	const regex = new RegExp(String.raw`href="(?!https?:\/\/|\/|#)([^"]+)"`, 'g');

	const normalizedBase = String(baseUrl ?? '').replace(/\/+$/, '');
	return String(html ?? '').replace(regex, (_match, relHref) => {
		const cleanRel = stripMdExt ? String(relHref).replace(/\.md$/, '') : String(relHref);
		return `href="${normalizedBase}/${cleanRel}"`;
	});
}

/**
 * Removes the first <h1 ...>...</h1> (non-greedy).
 * @param {string} html
 */
export function stripFirstH1(html) {
	return String(html ?? '').replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, '');
}

/**
 * Extract TypeDoc breadcrumbs if present (HTML <p> containing anchors + separators)
 */
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
