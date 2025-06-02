import { IncomingForm, Fields, Files, File } from "formidable";
import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const uploadDir = path.join(process.cwd(), "public", "img", "mockups");

  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
    multiples: false,
  });

  form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
    if (err) {
      console.error("Parse error:", err);
      return res.status(500).json({ error: "Error parsing file" });
    }

    const category =
      fields.category?.toString().replace(/\s+/g, "-").toLowerCase() ||
      "uncategorized";

    let file = files.file as unknown as File;

    if (Array.isArray(file)) file = file[0];
    if (!file || !file.filepath) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const categoryDir = path.join(uploadDir, category);
    if (!fs.existsSync(categoryDir)) fs.mkdirSync(categoryDir, { recursive: true });

    const filename = `${Date.now()}-${file.originalFilename || "upload"}`;
    const destPath = path.join(categoryDir, filename);

    fs.renameSync(file.filepath, destPath);

    const publicPath = `/img/mockups/${category}/${filename}`;
    return res.status(200).json({ imageUrl: publicPath });
  });
}
