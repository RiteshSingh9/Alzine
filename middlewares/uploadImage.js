const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Storage config for multer (store in temp)
const storage = multer.memoryStorage();
const upload = multer({ storage });

function getDateFolder() {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
}

const uploadImage = [
    upload.single('image'),
    async (req, res, next) => {
        if (!req.file) return res.status(400).json({ message: 'No image uploaded.' });

        const dateFolder = getDateFolder();
        const uploadDir = path.join(__dirname, '..', 'uploads', dateFolder);
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(req.file.originalname)}`;
        const filePath = path.join(uploadDir, uniqueName);

        try {
            // Compress and save image
            await sharp(req.file.buffer)
                .resize(800) // optional: resize to max width 800px
                .jpeg({ quality: 70 }) // compress to jpeg, adjust quality as needed
                .toFile(filePath);

            // Set image URL for next middleware/handler
            req.imageUrl = `/uploads/${dateFolder}/${uniqueName}`;
            next();
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Image processing failed.' });
        }
    }
];

module.exports = uploadImage;