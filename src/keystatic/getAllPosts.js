// src/lib/posts.js
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';
import { mapKeystaticPost } from './mapPost';

const reader = createReader(process.cwd(), keystaticConfig);

export async function getAllPosts() {
 const [rawPosts, rawAuthors, rawTags] = await Promise.all([
    reader.collections.blog.all({ resolveLinkedFiles: true }),
    reader.collections.authors.all({ resolveLinkedFiles: true }),
    reader.collections.tags.all(),
  ]);
  // console.log(rawPosts[0])
  // Map each raw post to your Post structure
 // 2. Map the posts and pass the reference data

  const posts = rawPosts.map(post => mapKeystaticPost(post, rawAuthors, rawTags));
  // console.log(rawAuthors,'----------------------------');
  // Sort by date descending
  posts.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());

  return posts;
}
