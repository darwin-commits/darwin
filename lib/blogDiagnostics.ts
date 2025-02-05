import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export function diagnosePostIssues() {
  const contentDir = path.join(process.cwd(), "content");
  const issues: string[] = [];
  
  // Check if content directory exists
  if (!fs.existsSync(contentDir)) {
    return ["Content directory not found at: " + contentDir];
  }

  try {
    const files = getAllMarkdownFiles(contentDir);
    
    if (files.length === 0) {
      issues.push("No index.md files found in the content directory");
    }

    files.forEach(filePath => {
      try {
        const fileContent = fs.readFileSync(filePath, "utf8");
        const { data } = matter(fileContent);
        const relativePath = path.relative(contentDir, filePath);
        
        // Check required frontmatter
        if (!data.title) issues.push(`Missing title in ${relativePath}`);
        if (!data.date) issues.push(`Missing date in ${relativePath}`);
        if (!data.description) issues.push(`Missing description in ${relativePath}`);
        
        // Validate path structure
        const pathParts = relativePath.split(path.sep);
        if (pathParts.length !== 5 || pathParts[4] !== "index.md") {
          issues.push(`Invalid path structure for ${relativePath}. Expected: year/month/day/slug/index.md`);
        }
        
        // Validate date parts are numbers
        const [year, month, day] = pathParts;
        if (isNaN(Number(year)) || isNaN(Number(month)) || isNaN(Number(day))) {
          issues.push(`Invalid date format in path: ${relativePath}`);
        }
      } catch (error) {
        // Type guard to check if error is an Error object
        if (error instanceof Error) {
          issues.push(`Error processing ${filePath}: ${error.message}`);
        } else {
          issues.push(`Error processing ${filePath}: Unknown error occurred`);
        }
      }
    });
  } catch (error) {
    // Type guard to check if error is an Error object
    if (error instanceof Error) {
      issues.push(`Error scanning directory: ${error.message}`);
    } else {
      issues.push(`Error scanning directory: Unknown error occurred`);
    }
  }

  return issues.length > 0 ? issues : ["No issues found. If posts still aren't showing, check your Next.js cache and try rebuilding."];
}

function getAllMarkdownFiles(dir: string): string[] {
  let files: string[] = [];
  
  fs.readdirSync(dir).forEach((fileOrDir) => {
    const fullPath = path.join(dir, fileOrDir);
    
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(getAllMarkdownFiles(fullPath));
    } else if (fileOrDir === "index.md") {
      files.push(fullPath);
    }
  });
  
  return files;
}