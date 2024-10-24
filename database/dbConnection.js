const mongoose = require('mongoose')

const dbConnection = async () => {
   try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log('connection successfull with database');
   } catch (error) {
    console.log('connection failed with database');
   }
}

module.exports = dbConnection;
