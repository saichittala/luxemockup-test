import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(process.cwd(), "public", "img", "mockups");
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Error parsing file" });

    const category = fields.category?.toString().replace(/\s+/g, "-").toLowerCase() || "uncategorized";
    const file = files.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const categoryDir = path.join(form.uploadDir, category);
    if (!fs.existsSync(categoryDir)) fs.mkdirSync(categoryDir, { recursive: true });

    const filename = `${Date.now()}-${file.originalFilename}`;
    const destPath = path.join(categoryDir, filename);

    fs.renameSync(file.filepath, destPath);

    // Return the public path to the image
    const publicPath = `/img/mockups/${category}/${filename}`;
    res.status(200).json({ imageUrl: publicPath });
  });
}