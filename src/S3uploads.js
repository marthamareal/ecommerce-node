const { Router } = require("express");
const multer = require("multer");
const { uploadBufferToS3 } = require("./services/S3service");
// const { requireAdmin } = require("../middleware/auth"); // wire up to your existing auth

const router = Router();

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per image
const MAX_FILES = 8;

const upload = multer({
    storage: multer.memoryStorage(), // files live in RAM only for the length of the request, never written to disk
    limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILES },
    fileFilter: (req, file, cb) => {
        console.log(file.mimetype)
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image files are allowed."));
        }
        cb(null, true);
    },
});

/**
 * POST /uploads/images
 * multipart/form-data, field name: "images" (accepts 1 or many)
 *
 * Returns: { images: [{ url, key }, ...] }
 *
 * This is a standalone upload step — it does NOT touch the database. The
 * frontend calls this first (before or during product creation), collects
 * the returned urls/keys, then sends them along in the POST /products body.
 */
router.post(
    "/images",
    /* requireAdmin, */
    upload.array("images", MAX_FILES),
    async (req, res) => {
        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: "No files were uploaded." });
            }

            const results = await Promise.all(
                req.files.map((file) =>
                    uploadBufferToS3({
                        buffer: file.buffer,
                        filename: file.originalname,
                        contentType: file.mimetype,
                        prefix: "products", // staged under products/ even before a productId exists
                    })
                )
            );

            res.status(201).json({ images: results });
        } catch (err) {
            console.error(err);
            res.status(400).json({ message: err.message ?? "Upload failed." });
        }
    }
);

// Surfaces multer-specific errors (file too large, too many files) as clean JSON
// instead of Express's default HTML error page.
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
    }
    if (err) {
        return res.status(400).json({ message: err.message ?? "Upload failed." });
    }
    next();
});

module.exports = router;
