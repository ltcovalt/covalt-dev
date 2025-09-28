import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';

// define collections
const posts = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
});

const code = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/code' }),
});

// export all collections as a single collections object
export const collections = { posts, code };