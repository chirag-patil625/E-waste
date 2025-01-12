const mongoose = require('mongoose');

const mongoDBURL = "mongodb://127.0.0.1:27017/eWaste?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.7";

const connectToMongo = async () => {
    try {
        if (!mongoDBURL) {
            throw new Error('MONGODB_URI is not defined in the .env file');
        }
        await mongoose.connect(mongoDBURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connection Successful");
    } catch (err) {
        console.error("Connection Error:", err.message);
    }
};

module.exports = connectToMongo;