import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// define collections
const posts = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
});

const docs = defineCollection({
	loader: glob({ pattern: '**/index.{md,mdx}', base: './docs' }),
	schema: z.object({
		description: z.string(),
		env: z.object({
			api: z.string(),
			platform: z.string(),
			runtime: z.string(),
			resource: z.string(),
		}),
		requires: z.array(z.string()).optional(),
		tags: z.array(z.string()),
	}),
});

const sourceCode = defineCollection({
	loader: glob({ pattern: '**/source.{md,mdx}', base: './docs' }),
	schema: z.object({
		description: z.string(),
		env: z.object({
			api: z.string(),
			platform: z.string(),
			runtime: z.string(),
			resource: z.string(),
		}),
		requires: z.array(z.string()).optional(),
		tags: z.array(z.string()),
	}),
});

// export all collections as a single collections object
export const collections = { docs, posts, sourceCode };
