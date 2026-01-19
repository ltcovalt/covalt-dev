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
export function typedocDiskPathToPublicId(typedocDiskPath, typedocPageMap = null) {
	const apiRootId = typedocDiskPathToRootApiId(typedocDiskPath);
	const restPath = stripDocsPrefix(typedocDiskPath).split('/typedoc/')[1] ?? '';
	const singleNamespaceNormalized = typedocPageMap
		? getSingleTopLevelNamespaceNormalized(typedocPageMap, apiRootId)
		: null;
	const normalized = normalizeTypedocRestPath(restPath, apiRootId, { singleNamespaceNormalized });
	const cleaned = String(normalized.restPath ?? '').replace(/\.md$/i, '');

	if (!cleaned) return trimSlashes(apiRootId);

	return `${trimSlashes(apiRootId)}/${cleaned}`;
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
		const resolved = resolveRelativeHref(normalizedBase, cleanRel);
		return `href="${resolved}"`;
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
 * Rewrite TypeDoc relative hrefs to canonical public paths.
 *
 * @param {string} relHref
 * @param {string} apiRootId
 * @returns {string | null}
 */
export function rewriteTypedocRelativeHref(relHref, apiRootId, typedocPageMap = null) {
	if (!relHref || !apiRootId) return null;

	const href = String(relHref);
	const [pathPart, hash] = href.split('#');
	const stripped = pathPart.replace(/^(\.\.\/|\.\/)+/, '').replace(/\/+$/, '');
	if (!stripped) return null;

	const singleNamespaceNormalized = typedocPageMap
		? getSingleTopLevelNamespaceNormalized(typedocPageMap, apiRootId)
		: null;
	const normalized = normalizeTypedocRestPath(stripped, apiRootId, { singleNamespaceNormalized });
	if (!normalized.restPath) {
		if (normalized.removedReadme || normalized.collapsedTopNamespace) {
			return `/docs/${trimSlashes(apiRootId)}${hash ? `#${hash}` : ''}`;
		}

		return null;
	}

	if (!normalized.changed) return null;

	const cleaned = String(normalized.restPath).replace(/\.md$/i, '');
	return `/docs/${trimSlashes(apiRootId)}/${cleaned}${hash ? `#${hash}` : ''}`;
}

/**
 * @param {string} relHref
 * @param {string} apiRootId
 * @returns {string | null}
 */
export function rewriteTypedocSectionHref(relHref, apiRootId) {
	if (!relHref || !apiRootId) return null;

	const href = String(relHref);
	const [pathPart, hash] = href.split('#');
	const stripped = pathPart.replace(/^(\.\.\/|\.\/)+/, '').replace(/\/+$/, '');
	if (!stripped) return null;

	const match = stripped.match(
		/^(classes|functions|interfaces|namespaces|types|variables|enumerations|modules|type-aliases|classes\/index|functions\/index|interfaces\/index|types\/index|variables\/index|enumerations\/index|modules\/index)(?:\/|$)/i,
	);
	if (!match) return null;

	const cleaned = stripped.replace(/\.md$/i, '');
	return `/docs/${trimSlashes(apiRootId)}/${cleaned}${hash ? `#${hash}` : ''}`;
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
 * Removes the paragraph immediately following the first H1.
 * @param {string} html
 * @returns {string}
 */
export function stripFirstH1Paragraph(html) {
	if (!html) return html;
	const wrapped = `<div id="__typedoc_root__">${html}</div>`;
	const { document } = parseHTML(wrapped);
	const root = document.getElementById('__typedoc_root__');
	if (!root) return String(html ?? '');

	const firstHeading = root.querySelector('h1');
	if (!firstHeading) return root.innerHTML;

	const next = firstHeading.nextElementSibling;
	if (next?.tagName === 'P') {
		next.remove();
	}

	return root.innerHTML;
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
			dedupeBreadcrumbLinks(el);
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

/**
 * @param {string} apiRootId
 * @returns {boolean}
 */
function isServiceNowApiRoot(apiRootId) {
	return trimSlashes(apiRootId).startsWith('servicenow/');
}

/**
 * @param {string} apiRootId
 * @returns {string}
 */
function getApiName(apiRootId) {
	const parts = trimSlashes(apiRootId).split('/');
	return parts[parts.length - 1] ?? '';
}

/**
 * Normalize a TypeDoc rest path (segment after /typedoc/) to a canonical public path.
 *
 * @param {string} restPath
 * @param {string} apiRootId
 * @returns {{ restPath: string, changed: boolean, removedReadme: boolean, collapsedTopNamespace: boolean }}
 */
function normalizeTypedocRestPath(restPath, apiRootId, opts = {}) {
	const original = String(restPath ?? '').replace(/^\/+/, '');
	const apiName = getApiName(apiRootId);
	const isServiceNow = isServiceNowApiRoot(apiRootId);
	const { singleNamespaceNormalized } = opts;

	let cleaned = original;
	let collapsedTopNamespace = false;

	if (apiName) {
		const parts = cleaned.split('/');
		const first = parts[0] ?? '';
		const second = parts[1] ?? '';
		const third = parts[2] ?? '';
		const matchesApi = normalizeSegment(first) === normalizeSegment(apiName);
		const matchesNamespace = normalizeSegment(third) === normalizeSegment(apiName);

		if (isServiceNow) {
			if (matchesApi && second === 'namespaces' && matchesNamespace) {
				parts.splice(0, 3);
				cleaned = parts.join('/');
				collapsedTopNamespace = true;
			} else if (matchesApi && second === 'namespaces' && singleNamespaceNormalized) {
				const normalizedNamespace = normalizeSegment(third);
				if (normalizedNamespace === singleNamespaceNormalized) {
					parts.splice(0, 3);
					cleaned = parts.join('/');
					collapsedTopNamespace = true;
				}
			}
		} else {
			if (matchesApi && second === 'namespaces') {
				parts.shift();
				cleaned = parts.join('/');
			}
		}
	}

	let removedReadme = false;
	if (/\/README\.md$/i.test(cleaned)) {
		cleaned = cleaned.replace(/\/README\.md$/i, '');
		removedReadme = true;
	} else if (/^README\.md$/i.test(cleaned)) {
		cleaned = '';
		removedReadme = true;
	}

	const changed = cleaned !== original || removedReadme || collapsedTopNamespace;
	return { restPath: cleaned, changed, removedReadme, collapsedTopNamespace };
}

/**
 * @param {string} value
 * @returns {string}
 */
function normalizeSegment(value) {
	return String(value ?? '')
		.toLowerCase()
		.replace(/[^a-z0-9]/g, '');
}

/**
 * Resolve a relative href against a base path and normalize ".." segments.
 * @param {string} basePath
 * @param {string} relHref
 * @returns {string}
 */
function resolveRelativeHref(basePath, relHref) {
	const normalizedBase = String(basePath ?? '').replace(/\/+$/, '') + '/';
	const url = new URL(relHref, `https://local${normalizedBase}`);
	return `${url.pathname}${url.search}${url.hash}`;
}

/**
 * @param {Record<string, () => Promise<any>>} typedocPageMap
 * @param {string} apiRootId
 * @returns {string | null}
 */
function getSingleTopLevelNamespaceNormalized(typedocPageMap, apiRootId) {
	const namespaces = new Set();

	for (const file of Object.keys(typedocPageMap ?? {})) {
		if (typedocDiskPathToRootApiId(file) !== trimSlashes(apiRootId)) continue;

		const restPath = stripDocsPrefix(file).split('/typedoc/')[1] ?? '';
		const parts = restPath.replace(/^\/+/, '').split('/');
		if (parts.length < 3) continue;
		if (parts[1] !== 'namespaces') continue;

		const normalized = normalizeSegment(parts[2]);
		if (normalized) namespaces.add(normalized);
	}

	if (namespaces.size === 1) return Array.from(namespaces)[0];

	return null;
}

/**
 * Remove duplicate breadcrumb links that point to the same target.
 * @param {Element} element
 */
function dedupeBreadcrumbLinks(element) {
	if (!element) return;

	let lastHref = null;
	const links = Array.from(element.querySelectorAll('a'));

	for (const link of links) {
		const href = link.getAttribute('href') ?? '';
		if (!href || href !== lastHref) {
			lastHref = href;
			continue;
		}

		const prev = link.previousSibling;
		if (prev && prev.nodeType === 3 && /^[\s\/›»]+$/.test(prev.textContent ?? '')) {
			prev.remove();
		}

		link.remove();
	}
}
