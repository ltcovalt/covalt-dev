// @ts-nocheck
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import remarkCodeImport from 'remark-code-import';
import remarkCodeLang from './plugins/remark-code-lang.js';
import remarkLinkComponent from './plugins/remark-link-component.js';
import rehypeCodeHeader from './plugins/rehype-code-header.js';

import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
	site: 'https://covalt.dev',
	integrations: [mdx(), sitemap()],
	vite: {
		plugins: [
			tailwindcss()
		],
		resolve: {
			alias: {
				'@components': path.resolve('./src/components'),
				'@layouts': path.resolve('./src/layouts'),
				'@utils': path.resolve('./src/utils'),
				'@icons': path.resolve('./src/icons'),
				'@content': path.resolve('./src/content')
			}
		},
		build: { cssCodeSplit: false }
	},
	build: { inlineStylesheets: 'always' },
	markdown: {
		extendDefaultPlugins: true,
		remarkPlugins: [remarkCodeImport, remarkCodeLang, remarkLinkComponent],
		rehypePlugins: [rehypeCodeHeader]
	},
});