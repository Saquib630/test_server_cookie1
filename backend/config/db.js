const mongoose = require("mongoose")


const connectDB = async() => {
    try {
        mongoose.connect("mongodb://127.0.0.1:27017/30_sept")
        console.log("mongoDB connected");
        
    } catch (error) {
        console.log("mongoDB err : " , error);
        
    }


} 

module.exports = connectDB