const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    highestBidder:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    highestBid: {
        type: Number
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        // required: true
    },
    description: {
        type: String,
        required: true
    },
    curstory:{
        type:String,
        required:true,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default:'upcoming'
    },
    startTime:{
        type: Date,
        required: true
    },
    endTime:{
        type: Date,
        required: true
    },
    startingPrice: {
        type: Number
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    logs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Log'
    }],
    status: {
        type: Boolean,
        default: true
    },
    
}, { createdAt: {type: Date,default: Date.now} })

const auctionModel = mongoose.model('Auction', auctionSchema);
module.exports = auctionModel;
