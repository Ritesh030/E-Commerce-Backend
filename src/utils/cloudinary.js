const cloudinary = require('cloudinary')
const {CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME} = require('../config/server_config.js');
const fs = require('fs');

cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localFilePath) => {
      if(!localFilePath){
            return null;
      }
      try {
            const response = await cloudinary.uploader.upload(
                  localFilePath,
                  { resource_type: "auto"}
            )
      
            fs.unlinkSync(localFilePath);
      
            return {
                  url: response.secure_url,
                  publicId: response.public_id
            }
      } catch (error) {
            console.error("Cloudinary upload Failed", error)
            if(fs.existsSync(localFilePath)){
                  fs.unlinkSync(localFilePath)
            }
      }
}

const deleteFromCloudinary = async (publicId) => {
      if(!publicId) return null;

      try {
            await cloudinary.uploader.destroy(publicId, {invalidate: true});
      } catch (error) {
            console.error("Failed to delete from cloudinary", error.message)
      }
}

module.exports = {
      uploadOnCloudinary,
      deleteFromCloudinary
}