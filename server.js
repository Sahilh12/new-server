const app = require("./app");
const PORT = process.env.PORT || 3000
const cloudinary = require('cloudinary')

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})