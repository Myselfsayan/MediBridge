import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,  // Always return https:// URLs
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        console.log("Uploading to Cloudinary:", localFilePath);

        const response = await cloudinary.uploader.upload(
            localFilePath,
            {
                resource_type: "auto",
            }
        );

        console.log(
            "Cloudinary upload successful:",
            response.secure_url
        );

        // Delete temporary file after successful upload
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return response;

    } catch (error) {
        console.error(
            "Cloudinary upload error:",
            error
        );

        // Delete temporary file if upload failed
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return null;
    }
};

    const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return;
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        return null;
    }
}
const getPublicIdFromUrl = (imageUrl) => {
    try {
        if (!imageUrl) return null;

        const url = new URL(imageUrl);

        const parts = url.pathname.split("/");
        const uploadIndex = parts.indexOf("upload");

        if (uploadIndex === -1) {
            return null;
        }

        let publicIdParts = parts.slice(uploadIndex + 1);

        // Remove version, e.g. v1786285935
        if (
            publicIdParts[0]?.startsWith("v") &&
            !isNaN(publicIdParts[0].slice(1))
        ) {
            publicIdParts.shift();
        }

        const publicIdWithExtension =
            publicIdParts.join("/");

        // Remove extension
        return publicIdWithExtension.replace(
            /\.[^/.]+$/,
            ""
        );

    } catch (error) {
        console.log(
            "Error extracting Cloudinary public ID:",
            error
        );

        return null;
    }
};

export { uploadOnCloudinary, deleteFromCloudinary , getPublicIdFromUrl };
