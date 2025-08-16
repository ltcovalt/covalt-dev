import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import remarkCodeImport from 'remark-code-import';
import remarkCodeLang from './plugins/remark-code-lang.js';
import rehypeCodeHeader from "./plugins/rehype-code-header.js";
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
		extendDefaultPlugins: true,
		remarkPlugins: [remarkCodeImport, remarkCodeLang],
		rehypePlugins: [rehypeCodeHeader]
	},
});
