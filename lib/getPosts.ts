import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");

// Recursive function to get all Markdown files from nested directories
function getAllMarkdownFiles(dir: string): string[] {
  let files: string[] = [];

  fs.readdirSync(dir).forEach((fileOrDir) => {
    const fullPath = path.join(dir, fileOrDir);

    if (fs.statSync(fullPath).isDirectory()) {
      // If it's a directory, recurse into it
      files = files.concat(getAllMarkdownFiles(fullPath));
    } else if (fileOrDir === "index.md") {
      // Only include markdown files named "index.md"
      files.push(fullPath);
    }
  });

  return files;
}

// Get all blog posts (reading nested directories)
export function getAllPosts() {
  const files = getAllMarkdownFiles(contentDir);

  return files.map((filePath) => {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContent);

    // Extract year, month, day, and slug from file path
    const relativePath = path.relative(contentDir, filePath);
    const [year, month, day, slug] = relativePath.split(path.sep);

    return {
      year,
      month,
      day,
      slug,
      title: data.title,
      date: data.date,
      description: data.description,
    };
  });
}

// Get a single blog post (handling nested directories)
export function getPostBySlug(year: string, month: string, day: string, slug: string) {
  const filePath = path.join(contentDir, year, month, day, slug, "index.md");

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);

  return {
    data,
    content,
  };
}