const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    auctionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auction',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    bidAmount: {
        type: Number,
        required: true
    },
    bidTime: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Log', logSchema);