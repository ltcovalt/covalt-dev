// @ts-nocheck
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import remarkCodeImport from 'remark-code-import';
import remarkCodeLang from './plugins/remark-code-lang.js';
import rehypeCodeHeader from "./plugins/rehype-code-header.js";
import path from 'node:path';
import mdx from '@astrojs/mdx';

export default defineConfig({
	integrations: [mdx()],
	vite: {
		plugins: [
			tailwindcss()
		],
		resolve: {
			alias: {
				'@components': path.resolve('./src/components'),
				'@layouts': path.resolve('./src/layouts'),
				'@utils': path.resolve('./src/utils'),
				'@icons': path.resolve('./src/icons')
			}
		}
	},
	markdown: {
		extendDefaultPlugins: true,
		remarkPlugins: [remarkCodeImport, remarkCodeLang],
		rehypePlugins: [rehypeCodeHeader]
	},
});
