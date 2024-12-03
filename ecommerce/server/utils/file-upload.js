const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');

const uploadBase64Images = async (base64Images, directory, altText) => {
    try {
        const image = [];
        for (const base64Image of base64Images) {
            const mimeType = base64Image.split(';')[0].split(':')[1];
            const extension = mimeType.split('/')[1];
            const filename = `${dayjs().format('YYYYMMDDHHmmss')}-${Math.random()
                .toString(36)
                .substr(2, 9)}.${extension}`;
            const uploadDir = path.join(__dirname, '..', 'uploads', directory);

            // Ensure the upload directory exists
            fs.mkdirSync(uploadDir, { recursive: true });

            const filePath = path.join(uploadDir, filename);
            const base64Data = base64Image.split(';base64,').pop();

            // Write the file to disk
            fs.writeFileSync(filePath, base64Data, { encoding: 'base64' });

            image.push({ url: filePath, alt: altText || 'Product Image' });
        }

        return image; // Return array of uploaded image objects
    } catch (err) {
        console.error("Error saving images:", err);
        throw new Error("Error processing images");
    }
};

module.exports = {
    uploadBase64Images,
};
