import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const collections = {
  blog: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdoc}', base: './src/content/blog' }),
    schema: z.object({
      title: z.string(),
      publishedDate: z.coerce.date(),
      tags: z.array(z.string()),
    }),
  }),

  tags: defineCollection({
    loader: glob({ pattern: '**/*.{json,yaml,yml}', base: './src/content/tags' }),
    schema: z.object({
      title: z.string(),
      description: z.string().optional(),
    }),
  }),

  authors: defineCollection({
    loader: glob({ pattern: '**/*.{json,yaml,yml}', base: './src/content/authors' }),
    schema: z.object({
      name: z.string(),
      bio: z.string().optional(),
      image: z.string().optional(),
    }),
  }),
};