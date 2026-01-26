import { defineCollection, z, getCollection} from 'astro:content';
import { calculateReadingTime } from "./helpers/readingTime";

const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date().optional(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		lang: z.string(),
		author: z.string().optional(),
		tags: z.array(z.string()).optional(),
	}),
});

export const collections = { blog };

export async function getBlogPosts() {
	const posts = await getCollection('blog');

	return posts.map((post) => {
		const blog_slug = post.slug.split('/')[0];
		const readingTime = calculateReadingTime(post.body ?? '');
		return {
			...post,
			blog_slug,
			readingTime,
		}
	})
}

// Constantes de paginación
export const PAGINATION_SIZE = 15;
export const MAX_TAGS_DISPLAY = 15;

// Obtener posts filtrados por idioma y ordenados por fecha
export async function getBlogPostsByLang(lang: string) {
	const posts = await getBlogPosts();
	return posts
		.filter((post) => post.data.lang === lang)
		.sort(
			(a, b) =>
				(b.data.pubDate?.valueOf() ?? 0) - (a.data.pubDate?.valueOf() ?? 0)
		);
}

// Normalizar tags asegurando que sea un array
export const normalizeTags = (tags: string[] | undefined): string[] =>
	Array.isArray(tags) ? tags : [];

export async function getRelatedPosts({
	currentPost,
	lang,
	limit = 3,
}: {
	currentPost: Awaited<ReturnType<typeof getBlogPosts>>[number];
	lang: string;
	limit?: number;
}) {
	const allPosts = await getBlogPosts();
	const currentTags = normalizeTags(currentPost.data.tags);

	return allPosts
		.filter(
			(post) => post.blog_slug !== currentPost.blog_slug && post.data.lang === lang
		)
		.map((post) => {
			const tags = normalizeTags(post.data.tags);
			const sharedTags = tags.filter((tag) => currentTags.includes(tag));

			return {
				...post,
				sharedTags,
				sharedCount: sharedTags.length,
			};
		})
		.filter((post) => post.sharedCount > 0)
		.sort((a, b) => {
			if (b.sharedCount !== a.sharedCount) {
				return b.sharedCount - a.sharedCount;
			}

			return (b.data.pubDate?.valueOf() ?? 0) - (a.data.pubDate?.valueOf() ?? 0);
		})
		.slice(0, limit);
}
