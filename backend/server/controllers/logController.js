const auctionModel = require('./autionModel');
const logModel = require('./logModel');

// create log

const create = async (req, res) => {
    try {
        delete req.body['usingId'];
        // console.log(req.body);
        if(!req.body.auctionId,!req.body.userId,!req.body.bidAmount) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all fields'
            });
        }
        const { auctionId, userId, bidAmount } = req.body;
        const log = await logModel.create({
            auctionId,
            userId,
            bidAmount
        });

        const auction = await auctionModel.findByIdAndUpdate(auctionId, {
            $push: { logs: log._id }
        });

        if(!auction) {

            const delbid = await logModel.findByIdAndDelete(log._id);

            return res.status(404).json({
                success: false,
                message: 'Auction not found'
            });
        }

        const auc = await auctionModel.findOne({_id:auctionId});
        if(!auc) {
            const delbid = await logModel.findByIdAndDelete(log._id);
            return res.status(404).json({
                success: false,
                message: 'Auction not found'
            });
        }
        if(bidAmount > auc.highestBid) {
            auc.highestBid = bidAmount;
            auc.highestBidder = userId;
            const updatedAuc = await auc.save();
            console.log('updatd bid from log-',updatedAuc);
        }

        const populatedLog = await logModel.findById(log._id).populate('userId');
        
        res.status(201).json({
            success: true,
            message: 'Log created successfully',
            data:populatedLog
        });
    }catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}

// read log

const read = async (req, res) => {
    try {
        const data=req.body;
        const log = await logModel.find(data);
        return res.status(200).json({
            success: true,
            message: 'Log fetched successfully',
            data:log
        });
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}

module.exports = { create, read };
