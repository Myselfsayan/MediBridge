import multer from "multer";
import fs from "fs";
import path from "path";

// Ensure the temporary upload directory exists
const tempDir = path.resolve("./public/temp");
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        cb(null, tempDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname || "");
        const safeBaseName = path
            .basename(file.originalname || "image", ext)
            .replace(/[^a-zA-Z0-9_-]/g, "_");
        cb(null, `${safeBaseName}-${uniqueSuffix}${ext}`);
    }
});

export const upload = multer({ 
    storage 
});