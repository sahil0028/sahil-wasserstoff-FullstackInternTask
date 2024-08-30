const mongoose = require('mongoose');
const mongoURL = 'mongodb://0.0.0.0:27017/BiddingManagement';

const connectDb = async () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(mongoURL).then(()=>{console.log("----Connected to Mongo Successfully!---");}).catch((error)=>{console.log('DB error :',error);})

  } catch (error) {
    console.log('DB error :',error);
  }
};

module.exports = connectDb;