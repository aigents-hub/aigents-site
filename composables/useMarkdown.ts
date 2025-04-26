import { remark } from "remark";
import html from "remark-html";
import DOMPurify from "dompurify";

export const useMarkdown = async (markdown: string) => {
  const result = await remark().use(html).process(markdown);
  return DOMPurify.sanitize(result.toString());
};
