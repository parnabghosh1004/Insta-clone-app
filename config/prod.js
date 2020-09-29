module.exports = {
    MongoURI: process.env.MongoURI,
    JWT_SECRET: process.env.JWT_SEC,
    SENDGRID: {
        API_KEY: process.env.SENDGRID_API_KEY,
        EMAIL: process.env.SENDGRID_EMAIL,
    },
    CLOUDINARY: {
        CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
        API_KEY: process.env.CLOUDINARY_API_KEY,
        API_SECRET: process.env.CLOUDINARY_API_SECRET,
        UPLOAD_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET
    }
}