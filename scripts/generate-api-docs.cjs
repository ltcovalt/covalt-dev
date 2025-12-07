#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const repoRoot = path.resolve(__dirname, '..');
const docsRoot = path.join(repoRoot, 'docs');
const typedocConfigPath = path.join(repoRoot, 'typedoc.json');

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

// Discover platform names from directory names - i.e., /docs/<platform>/
const platforms = fs
	.readdirSync(docsRoot)
	.map((platformDirName) => ({
		dirName: platformDirName,
		platformDirPath: path.join(docsRoot, platformDirName),
	}))
	.filter((platform) => isDirectory(platform.platformDirPath));

// Discover APIs under each platform - i.e., /docs/<platform>/<apiName>
const apiTargets = platforms
	.flatMap((platform) => {
		const apiDirs = fs
			.readdirSync(platform.platformDirPath)
			.map((apiDirName) => ({
				dirName: apiDirName,
				apiDirPath: path.join(platform.platformDirPath, apiDirName),
			}))
			.filter((api) => isDirectory(api.apiDirPath));

		return apiDirs
			.map((api) => {
				// Look for .js files directly inside the API dir (ignore subdirs)
				const entries = fs.readdirSync(api.apiDirPath, { withFileTypes: true });
				const jsFiles = entries
					.filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.js'))
					.map((entry) => path.join(api.apiDirPath, entry.name))
					.filter((fullPath) => isFile(fullPath));

				if (jsFiles.length === 0) {
					console.warn(`[typedoc] Skipping ${platform.dirName}/${api.dirName} – no JS entry file found`);
					return null;
				}

				// If there are multiple .js files, warn and pick the first (sorted) as the entry.
				jsFiles.sort(); // deterministic choice
				if (jsFiles.length > 1) {
					console.warn(
						`[typedoc] ${platform.dirName}/${api.dirName} has multiple JS files:\n  ${jsFiles
							.map((p) => path.relative(repoRoot, p))
							.join('\n  ')}\n  -> Using ${path.relative(repoRoot, jsFiles[0])} as the entry point.`,
					);
				}

				const entryFilePath = jsFiles[0];
				const entryFileBaseName = path.basename(entryFilePath, path.extname(entryFilePath));

				return {
					platformDirName: platform.dirName,
					apiDirName: api.dirName,
					entryFilePath,
					entryFileBaseName,
					outDirPath: api.apiDirPath,
				};
			})
			.filter(Boolean);
	})
	.filter(Boolean);

if (apiTargets.length === 0) {
	console.warn('[typedoc] No APIs found under docs/<platform>/<api>/');
	process.exit(0);
}

for (const target of apiTargets) {
	const { platformDirName, apiDirName, entryFilePath, entryFileBaseName, outDirPath } = target;

	console.log(
		`\n[typedoc] Building docs for ${platformDirName}/${apiDirName} (${path.relative(repoRoot, entryFilePath)})`,
	);

	// Ensure output directory exists
	fs.mkdirSync(outDirPath, { recursive: true });

	const args = [
		'--options',
		typedocConfigPath,
		'--entryPoints',
		entryFilePath,
		'--out',
		path.join(outDirPath, 'typedoc'),
		'--name',
		entryFileBaseName,
		// '--publicPath',
		// `/docs/${platformDirName}/${apiDirName}/`,
		'--navigationJson',
		`${outDirPath}/typedoc/navigation.json`,
	];

	const result = spawnSync(path.join(repoRoot, 'node_modules', '.bin', 'typedoc'), args, {
		stdio: 'inherit',
		cwd: repoRoot,
	});

	if (result.status !== 0) {
		console.error(`[typedoc] Failed for ${platformDirName}/${apiDirName}`);
		process.exit(result.status ?? 1);
	}
}

console.log('\n[typedoc] All API docs generated.');
