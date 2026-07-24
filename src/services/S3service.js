const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require("crypto");

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const BUCKET = process.env.AWS_S3_BUCKET;
const CDN_BASE_URL = process.env.CDN_BASE_URL; // CloudFront domain, no trailing slash

const ALLOWED_CONTENT_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
]);

const MAX_FILENAME_LENGTH = 100;

function buildKey(prefix, filename) {
    const ext = filename.split(".").pop().toLowerCase();
    const safeBase = filename
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9-_]/g, "-")
        .slice(0, MAX_FILENAME_LENGTH);
    return `${prefix}/${crypto.randomUUID()}-${safeBase}.${ext}`;
}

/**
 * Uploads a file buffer (e.g. from multer's memoryStorage) directly to S3
 * from the backend. Used by the /uploads route where the browser sends the
 * file to our API instead of talking to S3 directly.
 */
async function uploadBufferToS3({ buffer, filename, contentType, prefix = "uploads" }) {
    if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
        throw new Error(`Unsupported content type: ${contentType}`);
    }

    const key = buildKey(prefix, filename);

    await s3.send(
        new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: buffer,
            ContentType: contentType,
        })
    );

    return { key, url: `${CDN_BASE_URL}/${key}` };
}

async function deleteObject(key) {
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

module.exports = { uploadBufferToS3, deleteObject };
