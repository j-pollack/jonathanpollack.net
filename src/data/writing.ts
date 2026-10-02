import type { MarkdownInstance } from 'astro';

export interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  project?: string;
}

export const posts = Object.values(import.meta.glob<MarkdownInstance<PostFrontmatter>>(
  '../pages/writing/*.md', { eager: true },
)).sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date)
  || b.frontmatter.title.localeCompare(a.frontmatter.title));

export const longDate = new Intl.DateTimeFormat('en-US', {
  month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
});
export const shortDate = new Intl.DateTimeFormat('en-US', {
  month: 'short', day: '2-digit', timeZone: 'UTC',
});
