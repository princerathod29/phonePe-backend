const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('mongoDb connected successfully');
    }catch(error) {
        console.error('Error connecting to mongoDb:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
