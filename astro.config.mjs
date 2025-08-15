// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import remarkCodeImport from 'remark-code-import';
import path from 'node:path';

export default defineConfig({
	vite: {
		plugins: [
			tailwindcss()
		],
		resolve: {
			alias: {
				'@components': path.resolve('./src/components'),
				'@layouts': path.resolve('./src/layouts'),
				'@pages': path.resolve('./src/pages')
			}
		}
	},
	markdown: {
		remarkPlugins: [remarkCodeImport],
	},
});
