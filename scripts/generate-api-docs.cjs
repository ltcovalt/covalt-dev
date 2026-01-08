#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const repoRoot = path.resolve(__dirname, '..');
const docsRoot = path.join(repoRoot, 'docs');
const typedocConfigPath = path.join(repoRoot, 'typedoc.json');
const typedocTsconfigBasePath = path.join(repoRoot, 'tsconfig.typedoc.json');

/**
 * If true, temporary TypeDoc generation folders will not be cleaned up after running.
 * If false, temporary directories and all contents will be deleted on script completion.
 */
const KEEP_TEMP = process.argv.includes('--keep-temp');

/**
 * Checks if a path is a directory
 * @param {import('node:fs').PathLike} p - the path to be checked
 * @returns {boolean}
 */
function isDirectory(p) {
	try {
		return fs.statSync(p).isDirectory();
	} catch {
		return false;
	}
}

/**
 * Checks if a path is a file
 * @param {import('node:fs').PathLike} p - the path to be checked
 * @returns {boolean}
 */
function isFile(p) {
	try {
		return fs.statSync(p).isFile();
	} catch {
		return false;
	}
}

/**
 * Convertes a windows formatted path to POSIX compliant path
 */
function toPosixPath(p) {
	return p.split(path.sep).join('/');
}

/**
 * List immediate .js files inside dir (no recursion), deterministic.
 * @param {string} dir
 * @returns {string[]} absolute paths
 */
function listJsFilesInDir(dir) {
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	return entries
		.filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.js'))
		.map((e) => path.join(dir, e.name))
		.filter(isFile)
		.sort((a, b) => a.localeCompare(b));
}

/**
 * List immediate subdirectories (no recursion), skipping generated/hidden dirs.
 * @param {string} dir
 * @returns {string[]} absolute paths
 */
function listChildDirs(dir) {
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	return entries
		.filter((e) => e.isDirectory())
		.map((e) => path.join(dir, e.name))
		.filter(isDirectory)
		.filter((p) => {
			const name = path.basename(p);
			return name !== 'typedoc' && !name.startsWith('.');
		})
		.sort((a, b) => a.localeCompare(b));
}

/**
 * Recursively discover API targets as directories under docs/<platform>/...
 * API targets are any directory that contain at least one .js file.
 * Stops recursing once an API directory is discovered. This allows sub-directories
 * to contain additional helper functions, docs, etc. without TypeDoc attempting to parse.
 * @returns {object[]} - returns an array of API targets. Includes rel, entryFilePath, entryFileBaseName, and outDirPath string properties.
 */
function discoverApiTargets() {
	/** @type {Array<{ rel: string, entryFilePath: string, entryFileBaseName: string, outDirPath: string }>} */
	const targets = [];

	if (!isDirectory(docsRoot)) return targets;

	/** @param {string} dir */
	function walk(dir) {
		const jsFiles = listJsFilesInDir(dir);

		// If this directory contains JS files, treat it as an API dir and do not recurse into children.
		if (jsFiles.length > 0) {
			const entryFilePath = jsFiles[0];
			const entryFileBaseName = path.basename(entryFilePath, path.extname(entryFilePath));
			const rel = path.relative(docsRoot, dir);

			if (jsFiles.length > 1) {
				console.warn(
					`[typedoc] ${rel} has multiple JS files:\n  ${jsFiles
						.map((p) => path.relative(repoRoot, p))
						.join('\n  ')}\n  -> Using ${path.relative(repoRoot, entryFilePath)} as the entry point.`,
				);
			}

			targets.push({
				rel,
				entryFilePath,
				entryFileBaseName,
				outDirPath: dir,
			});
			return;
		}

		// Otherwise, recurse into subdirectories
		for (const child of listChildDirs(dir)) walk(child);
	}

	// Start walking at docs/* (skip hidden / typedoc via listChildDirs)
	for (const root of listChildDirs(docsRoot)) walk(root);

	// Sort targets to ensure deterministic build order
	targets.sort((a, b) => a.rel.localeCompare(b.rel));
	return targets;
}

/**
 * Writes a per-API temporary tsconfig which extends the base typedoc tsconfig
 * but restricts the program to a single entry file, avoiding global collisions.
 *
 * @param {string} outDir - absolute path to the api's typedoc output dir
 * @param {string} entryFilePath - absolute path to the api entry file
 * @returns {string} absolute path to the temp tsconfig file
 */
function writeTempTsconfig(outDir, entryFilePath) {
	if (!isFile(typedocTsconfigBasePath)) {
		throw new Error(`Missing base tsconfig for typedoc at: ${typedocTsconfigBasePath}`);
	}

	fs.mkdirSync(outDir, { recursive: true });

	const tmpTsconfigPath = path.join(outDir, 'tsconfig.typedoc.tmp.json');

	const tmp = {
		extends: toPosixPath(typedocTsconfigBasePath),
		files: [toPosixPath(entryFilePath)],
		include: [],
		exclude: [],
	};

	fs.writeFileSync(tmpTsconfigPath, JSON.stringify(tmp, null, 2) + '\n', 'utf8');
	return tmpTsconfigPath;
}

function safeUnlink(p) {
	try {
		fs.unlinkSync(p);
	} catch {
		// ignore
	}
}

function safePurgeTypedocDir(outDir) {
	// Hard safety checks to prevent accidental deletion outside typedoc/
	const resolved = path.resolve(outDir);

	if (path.basename(resolved) !== 'typedoc') {
		throw new Error(`Refusing to delete non-typedoc directory: ${resolved}`);
	}

	// Ensure we're deleting somewhere under the repo root (extra guard)
	const rel = path.relative(repoRoot, resolved);
	if (rel.startsWith('..') || path.isAbsolute(rel) === true) {
		throw new Error(`Refusing to delete directory outside repoRoot: ${resolved}`);
	}

	// Purge ONLY the typedoc directory (no siblings)
	fs.rmSync(resolved, { recursive: true, force: true });
	fs.mkdirSync(resolved, { recursive: true });
}

const apiTargets = discoverApiTargets();

if (apiTargets.length === 0) {
	console.warn('[typedoc] No APIs found under docs/** (directories containing .js entry files).');
	process.exit(0);
}

for (const target of apiTargets) {
	const { rel, entryFilePath, entryFileBaseName, outDirPath } = target;
	console.log(`\n[typedoc] Building docs for ${rel} (${path.relative(repoRoot, entryFilePath)})`);
	// Ensure API directory exists
	fs.mkdirSync(outDirPath, { recursive: true });

	const outDir = path.join(outDirPath, 'typedoc');
	const navJson = path.join(outDirPath, 'typedoc', 'navigation.json');

	// Purge stale typedoc output for this API ONLY (never touches siblings)
	safePurgeTypedocDir(outDir);

	// Write a per-API tsconfig so this run only sees the entry file.
	const tmpTsconfigPath = writeTempTsconfig(outDir, entryFilePath);

	const args = [
		'--options',
		toPosixPath(typedocConfigPath),
		// Override tsconfig per run to avoid cross-file global collisions.
		'--tsconfig',
		toPosixPath(tmpTsconfigPath),
		'--entryPointStrategy',
		'expand',
		'--entryPoints',
		toPosixPath(entryFilePath),
		'--out',
		toPosixPath(outDir),
		'--name',
		entryFileBaseName,
		'--navigationJson',
		toPosixPath(navJson),
	];

	const result = spawnSync('npx', ['typedoc', ...args], {
		stdio: 'inherit',
		cwd: repoRoot,
		shell: process.platform === 'win32',
	});

	if (result.status !== 0) {
		console.error(`[typedoc] Failed for ${rel}`);
		// Keep temp tsconfig on failure unless explicitly asked to purge it
		if (!KEEP_TEMP) safeUnlink(tmpTsconfigPath); // best-effort
		process.exit(result.status ?? 1);
	}

	// Cleanup temp tsconfig on success unless explicitly kept.
	if (!KEEP_TEMP) safeUnlink(tmpTsconfigPath);
}

console.log('\n[typedoc] All API docs generated.');
