import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';

// define collections
const posts = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
});

const codePages = defineCollection({
	loader: glob({ pattern: '**/index.{md,mdx}', base: './docs' }),
});

// export all collections as a single collections object
export const collections = { posts, codePages };
