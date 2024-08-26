const AuctionModel = require('./autionModel');
const UserModel = require('./userModel');
const fs = require('fs')
const path = require('path')
// create auction

const create = async (req, res) => {
    try {
        console.log('req.body',req.body);
        console.log('req.body',req.file);
        // console.log('req.body',req.body);
        if( !req.body.userId || !req.body.title || !req.body.name || !req.body.description || !req.body.startTime || !req.body.endTime || !req.body.startingPrice) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all fields'
            });
        }

        // check user exist
        const user = await UserModel.findById({_id:req.body.userId});
        if(!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }
        const { userId, title, name, image, description, startTime, endTime, startingPrice } = req.body;
        // const auction = await AuctionModel.create({
        //     userId,
        //     title,
        //     name,
        //     // image,
        //     description,
        //     startTime,
        //     endTime,
        //     startingPrice
        // });
        let auction = new AuctionModel()
        auction.userId = userId;
        auction.title = title;
        auction.name = name;
        auction.description = description;
        auction.startTime = startTime;
        auction.endTime = endTime;
        auction.startingPrice = startingPrice;
        if(!!req.file){
            auction.image = '/auc/'+req.file.filename;
        }
        const newAuction = await auction.save();
        console.log('new-auc-',newAuction);
        res.status(201).json({
            success: true,
            message: 'Auction created successfully',
            data:newAuction
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}

// readd auction

const read = async (req, res) => {
    try {
        // console.log('get auction');
        delete req.body['usingId'];
        // console.log(req.body);

        const auction = await AuctionModel.find(req.body).populate('userId');
        res.status(200).json({
            success: true,
            message: 'Auction fetched successfully',
            data:auction
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}
const bidread = async (req, res) => {
    try {
        // console.log('get auction');
        delete req.body['usingId'];
        // console.log(req.body);
        const auction = await AuctionModel.find(req.body).populate('userId',{name:1}).populate([ 
            { path: 'logs', populate: [ { path: 'userId', select: '_id name' } ] },
            // { path: 'subUsers', select: '_id name' }  
        ])
        // console.log(auction);

        res.status(200).json({
            success: true,
            message: 'Auction fetched successfully',
            data:auction
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}

// participate auction
const partAuc = async(req,res)=>{
    try {
        if(!req.body.userId || !req.body.auctionId) {
            return res.status(400).json({
                success: false,
                message: 'Required Ids not found'
            });
        }
        const auction = await AuctionModel.findById({_id:req.body.auctionId,status:true});
        if(!auction || auction.endTime<new Date()) {
            // console.log('not auc or end time')
            return res.status(400).json({
                success: false,
                message: 'Auction not found'
            });
        }
        const user = await UserModel.findById({_id:req.body.userId});
        if(!user) {
            // console.log('not user')
            return res.status(400).json({
                success: false,
                message: 'User not found'
            })
        }
        


        // check user already participated in this auction
        let participatedUser = false;
        let participatedAuc = false;
        for(let i=0;i<user.participations.length;i++){
            if(user.participations[i].toString()===auction._id.toString()){
                participatedUser = true;
                break;
            }
        }
        for(let i=0;i<auction.participants.length;i++){
            if(auction.participants[i].toString()===req.body.userId.toString()){
                participatedAuc = true;
                break;
            }
        }
        if(participatedUser && participatedAuc){
            return res.status(200).json({
                success: true,
                message: 'Already participated in this auction'
            })
        }

        let updatedAuc,updatedUser;
        if(!participatedUser){
            user.participations.push(auction._id);
            updatedUser = await user.save();
        }
        if(!participatedAuc){
            auction.participants.push(req.body.userId);
            updatedAuc = await auction.save();
        }
        res.status(200).json({
            success: true,
            message: 'Auction participated successfully',
            data:{updatedAuc,updatedUser}
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
        
    }
}

const getPartAuc = async(req,res)=>{
    try {
        if(!req.body.userId) {
            return res.status(400).json({
                success: false,
                message: 'Required Ids not found'
            });
        }
        const user = await UserModel.findById({_id:req.body.userId}).populate('participations');
        if(!user) {
            // console.log('not user')
            return res.status(400).json({
                success: false,
                message: 'User not found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Auction participated successfully',
            data:user.participations
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
        
    }
}

// update auction
const updateAuc = async(req,res)=>{
    try {
        // console.log('update auc',req.body);
        if(!req.body.userId || !req.body.auctionId) {
            return res.status(400).json({
                success: false,
                message: 'Required Ids not found'
            });
        }
        const auction = await AuctionModel.findOne({_id:req.body.auctionId,userId:req.body.userId});
        if(!auction) {
            // console.log('not auc or end time')
            return res.status(400).json({
                success: false,
                message: 'Auction not found'
            });
        }
        let prevImg = auction.image;
        if(req.body.title) auction.title = req.body.title;
        if(req.body.name) auction.name = req.body.name;
        if(req.body.description) auction.description = req.body.description;
        if(req.body.startTime) auction.startTime = req.body.startTime;
        if(req.body.endTime) auction.endTime = req.body.endTime;
        if(req.body.startingPrice) auction.startingPrice = req.body.startingPrice;
        // if(req.body.image) auction.image = req.body.image;

        if(req.body.status) auction.status = req.body.status;

        let upnew ='public'+prevImg;
        // console.log(upnew)
        if (prevImg.length>0 && !!req.file && fs.existsSync(upnew)) {
            // Delete the previous image
            console.log('in img deleting')
            fs.unlink('public'+prevImg, (err) => {
              if (err) {
                console.error('Error deleting old image:', err);
              } else {
                console.log('Old image deleted successfully.');
              }
        })};

        if(!!req.file){
            auction.image = '/auc/'+req.file.filename
        }
        // console.log('img---',auction.image)

        const updatedAuc = await auction.save();
        // console.log(updatedAuc)
        return res.status(200).json({
            success: true,
            message: 'Auction updated successfully',
            data:updatedAuc
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
        
    }
}

// delete auction ->cancel aution
const deleteAuc = async(req,res)=>{
    try {
        if(!req.body.userId || !req.body.auctionId) {
            return res.status(400).json({
                success: false,
                message: 'Required Ids not found'
            });
        }
        const auction = await AuctionModel.findOne({_id:req.body.auctionId,userId:req.body.userId});
        if(!auction) {
            // console.log('not auc or end time')
            return res.status(400).json({
                success: false,
                message: 'Auction not found'
            });
        }
        auction.status = false;
        const updatedAuc = await auction.save();
        return res.status(200).json({
            success: true,
            message: 'Auction deleted successfully',
            data:updatedAuc
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message:'Internal server error',
        })
    }
}
const adminDelAuc= async(req,res)=>{
    try {
        if(!req.body.auctionId) {
            return res.status(400).json({
                success: false,
                message: 'Required Ids not found'
            });
        }
        const auction = await AuctionModel.findOne({_id:req.body.auctionId});
        if(!auction) {
            // console.log('not auc or end time')
            return res.status(400).json({
                success: false,
                message: 'Auction not found'
            });
        }
        auction.status = false;
        const updatedAuc = await auction.save();
        return res.status(200).json({
            success: true,
            message: 'Auction deleted successfully',
            data:updatedAuc
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message:'Internal server error',
        })
    }
}


module.exports = { create , read, bidread , partAuc,getPartAuc,updateAuc,deleteAuc,adminDelAuc};
