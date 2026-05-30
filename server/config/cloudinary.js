const cloudinary = require('cloudinary').v2;

const getEnvValue = (key) => process.env[key]?.trim();

const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: getEnvValue('CLOUDINARY_CLOUD_NAME'),
    api_key: getEnvValue('CLOUDINARY_API_KEY'),
    api_secret:
      getEnvValue('CLOUDINARY_API_SECRET') ||
      getEnvValue('CLOUDINARY_SECRET_KEY'),
  });
};
module.exports = connectCloudinary;
