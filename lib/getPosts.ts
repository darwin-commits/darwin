import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");

// Get all blog posts
export function getAllPosts() {
  const files = fs.readdirSync(contentDir);

  return files.map((filename) => {
    const filePath = path.join(contentDir, filename);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContent);

    return {
      slug: filename.replace(".md", ""),
      title: data.title,
      date: data.date,
      description: data.description,
    };
  });
}

// Get a single blog post
export function getPostBySlug(slug: string) {
  const filePath = path.join(contentDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);

  return {
    data,
    content,
  };
}