import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ManualPage() {
  const filePath = path.join(process.cwd(), "MANUAL.md");
  const content = fs.readFileSync(filePath, "utf-8");

  return (
    <div className="prose prose-sm max-w-3xl rounded-lg border border-pccinza/20 bg-white p-6 prose-headings:text-pcmarrom prose-a:text-pclaranja prose-strong:text-pcmarrom prose-th:text-pcmarrom">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
