const mongoose = require('mongoose');
const mongoURL = 'mongodb://0.0.0.0:27017/BiddingManagement';
// const mongoURL = 'mongodb+srv://sahiljhumat0028:MHCIZ5aorEZdq3RN@assignment.r8a6guy.mongodb.net/biddingManage?retryWrites=true&w=majority&appName=Assignment';
const connectDb = async () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(mongoURL).then(()=>{console.log("----Connected to Mongo Successfully!---");}).catch((error)=>{console.log('DB error :',error);})

  } catch (error) {
    console.log('DB error :',error);
  }
};

module.exports = connectDb;