export function getUniqueTags(posts) {
  const tags = [];
  posts.forEach(post => {
    post.tags?.forEach(tag => {
      if (!tags.find(t => t.slug === tag.slug)) {
        tags.push(tag);
      }
    });
  });
  return tags;
}