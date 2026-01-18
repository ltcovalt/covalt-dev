/**
 * NOTE: this module is server-side only and should only be imported
 * from Astro server/frontmatter scripts. It uses import.meta.glob(),
 * which must remain a literal string at the module scope.
 */

import { parseHTML } from 'linkedom';

const TYPEDOC_PAGE_MAP = import.meta.glob('/docs/**/typedoc/**/*.md');
const TYPEDOC_README_MAP = import.meta.glob('/docs/**/typedoc/README.md');

/**
 * Get the TypeDoc page glob map (path -> loader function).
 * @returns {Record<string, () => Promise<any>>}
 */
export function getTypedocPageMap() {
	return TYPEDOC_PAGE_MAP;
}

/**
 * Get the TypeDoc README glob map (path -> loader function).
 * @returns {Record<string, () => Promise<any>>}
 */
export function getTypedocReadmeMap() {
	return TYPEDOC_README_MAP;
}

/**
 * Load compiled HTML from an import.meta.glob() map for a specific disk path.
 *
 * @param {Record<string, () => Promise<any>>} globMap - object returned by import.meta.glob()
 * @param {string} diskPath - exact key in the map (e.g. "/docs/.../typedoc/README.md")
 * @param {string} [label] - used only for error messages
 * @returns {Promise<string>}
 */
export async function loadCompiledHtmlFromGlob(globMap, diskPath, label = 'TypeDoc page') {
	const loader = globMap?.[diskPath];
	if (!loader) throw new Error(`No ${label} found for path: ${diskPath}`);

	const mod = await loader();
	const rawHtml = await mod?.compiledContent?.();
	if (!rawHtml) throw new Error(`No compiledContent() for ${label}: ${diskPath}`);

	return rawHtml;
}

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
 * @returns {string}
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
 * @returns {string}
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
 * @returns {string}
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
 * @returns {string}
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
 * @param {{ stripMdExt?: boolean, rewriteRelativeHref?: (relHref: string) => string | null }} [opts]
 * @returns {string}
 */
export function rewriteRelativeLinks(html, baseUrl, opts = {}) {
	const { stripMdExt = false, rewriteRelativeHref } = opts;

	// keep regex form consistent; avoids editor highlighting quirks with regex literals
	const regex = new RegExp(String.raw`href="(?!https?:\/\/|\/|#)([^"]+)"`, 'g');

	const normalizedBase = String(baseUrl ?? '').replace(/\/+$/, '');
	return String(html ?? '').replace(regex, (_match, relHref) => {
		const rewritten = rewriteRelativeHref?.(relHref);
		if (rewritten) return `href="${rewritten}"`;

		const cleanRel = stripMdExt ? String(relHref).replace(/\.md$/, '') : String(relHref);
		return `href="${normalizedBase}/${cleanRel}"`;
	});
}

/**
 * Find the first namespace README path for a given API root.
 *
 * @param {Record<string, () => Promise<any>>} typedocPageMap
 * @param {string} apiRootId
 * @returns {string | null}
 */
export function findNamespaceReadmePath(typedocPageMap, apiRootId) {
	const normalizedRoot = trimSlashes(apiRootId);
	const prefix = `/docs/${normalizedRoot}/typedoc/`;

	const candidates = Object.keys(typedocPageMap ?? {}).filter((path) => {
		return path.startsWith(prefix) && /\/namespaces\/[^/]+\/README\.md$/i.test(path);
	});

	if (!candidates.length) return null;

	candidates.sort((a, b) => {
		const depthA = a.split('/').length;
		const depthB = b.split('/').length;
		if (depthA !== depthB) return depthA - depthB;
		if (a.length !== b.length) return a.length - b.length;
		return a.localeCompare(b);
	});

	return candidates[0];
}

/**
 * Rewrite namespace README/root links to the API root URL.
 *
 * @param {string} relHref
 * @param {string} apiRootId
 * @returns {string | null}
 */
export function rewriteNamespaceReadmeHref(relHref, apiRootId) {
	if (!relHref || !apiRootId) return null;

	const href = String(relHref);
	const [pathPart, hash] = href.split('#');
	const stripped = pathPart.replace(/^(\.\.\/|\.\/)+/, '').replace(/\/+$/, '');
	const normalizedRoot = trimSlashes(apiRootId);
	const hashSuffix = hash ? `#${hash}` : '';

	if (stripped === 'README' || stripped === 'README.md') {
		return `/docs/${normalizedRoot}${hashSuffix}`;
	}

	if (/\/namespaces\/[^/]+\/README(?:\.md)?$/i.test(stripped)) {
		return `/docs/${normalizedRoot}${hashSuffix}`;
	}

	if (/\/namespaces\/[^/]+$/i.test(stripped)) {
		return `/docs/${normalizedRoot}${hashSuffix}`;
	}

	return null;
}

/**
 * Removes the first <h1 ...>...</h1> (non-greedy).
 * @param {string} html
 * @returns {string}
 */
export function stripFirstH1(html) {
	return String(html ?? '').replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, '');
}

/**
 * Extract TypeDoc breadcrumbs if present (HTML <p> containing anchors + separators),
 * remove that breadcrumb element from the content, and return both the cleaned HTML
 * and the breadcrumb HTML.
 *
 * @param {string} html
 * @returns {{ html: string, breadcrumbHtml: string | null }}
 */
export function extractBreadcrumbs(html) {
	// Wrap incoming HTML as a fragment root so linkedom doesn't invent <head>/<body>
	const wrapped = `<div id="__typedoc_root__">${html}</div>`;
	const { document } = parseHTML(wrapped);

	const root = document.getElementById('__typedoc_root__');
	if (!root) return { html: String(html ?? ''), breadcrumbHtml: null };

	const firstHeading = root.querySelector('h1');
	if (!firstHeading) return { html: root.innerHTML, breadcrumbHtml: null };

	// Scan backwards from the first H1 over previous *elements* looking for a breadcrumb-like <p>
	let el = firstHeading.previousElementSibling;
	while (el) {
		// Stop if we hit another heading before breadcrumbs
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

/**
 * @param {Element} element
 * @returns {boolean}
 */
function isBreadcrumbElement(element) {
	if (!element || element.tagName !== 'P') return false;

	const links = element.querySelectorAll(':scope > a');
	if (links.length < 1) return false;

	const fullText = (element.textContent || '').trim();
	// Common breadcrumb separators include "/" and chevrons
	if (!/[\/›»]/.test(fullText)) return false;

	// Remove anchors and check what remains (should mostly be separators and light text)
	const clone = element.cloneNode(true);
	clone.querySelectorAll('a').forEach((a) => a.remove());

	const leftover = (clone.textContent || '')
		.replace(/\u00A0/g, ' ')
		.replace(/\s+/g, '')
		.trim();

	// Allow trailing symbols like records(), dotted names, etc.
	return /^[\/›»]+[\p{L}\p{N}_.:()-]*$/u.test(leftover);
}
