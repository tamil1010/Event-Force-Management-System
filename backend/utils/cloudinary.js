const cloudinary = require('cloudinary').v2;

if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const uploadImageToCloudinary = async (fileBuffer, folder = 'event-force') => {
  // If Cloudinary keys are configured, upload to Cloudinary
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: folder, resource_type: 'auto' },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );
      uploadStream.end(fileBuffer);
    });
  } else {
    // Fallback if Cloudinary environment variables aren't set yet: convert buffer to data URI
    const base64Data = fileBuffer.toString('base64');
    const dataUri = `data:image/jpeg;base64,${base64Data}`;
    return {
      url: dataUri,
      public_id: `local_fallback_${Date.now()}`,
    };
  }
};

module.exports = { uploadImageToCloudinary };
