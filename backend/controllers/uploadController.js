const { uploadImageToCloudinary } = require('../utils/cloudinary');

// @desc    Upload image file to Cloudinary / memory storage
// @route   POST /api/upload
// @access  Private
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload' });
    }

    const folder = req.body.folder || 'event-force';
    const result = await uploadImageToCloudinary(req.file.buffer, folder);

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: result.url,
        public_id: result.public_id,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { uploadImage };
