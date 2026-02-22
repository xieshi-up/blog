import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

export async function renderMarkdownToHtml(markdown: string): Promise<string> {
  const rawHtml = await marked.parse(markdown);
  return purify.sanitize(rawHtml);
}