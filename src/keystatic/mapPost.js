

export function mapKeystaticPost(post, authors = [], tags = []) {
  const { entry, slug } = post;

  // We add default empty arrays [] above to prevent ".find is not a function" 
  // if the data fails to load for some reason.
  const authorEntry = authors.find(a => a.slug === entry.author);
 
  const resolvedTags = (entry.tags || []).map(tagSlug => {
    return tags.find(t => t.slug === tagSlug) || { slug: tagSlug, entry: { title: tagSlug } };
  });

  return {
    slug,
    title: entry.title,
    publishedAt: entry.publishedDate,
    description: entry.description || '',
    excerpt: entry.excerpt || '',
   mainImageUrl: entry.mainImageUrl || null,
    content: entry.content, // This will be the Markdoc object
    // Expanded data:
   author: authorEntry ? { ...authorEntry.entry, slug: authorEntry.slug } : null,
    tags: resolvedTags.map(t => ({ ...t.entry, slug: t.slug })),
  };
}