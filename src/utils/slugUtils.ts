/**
 * Convert a title to a URL-friendly slug
 */
export function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Convert a slug back to find content by title matching
 */
export function slugToTitlePattern(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .toLowerCase();
}

/**
 * Find blog post by slug from a list of posts
 */
export function findPostBySlug(posts: any[], slug: string): any | null {
  const titlePattern = slugToTitlePattern(slug);
  
  return posts.find(post => {
    const postTitleSlug = titleToSlug(post.title);
    return postTitleSlug === slug;
  }) || null;
}