const express = require('express');
const router = express.Router();

const fs = require('fs')
const path = require('path')
const multer = require('multer')

const userController = require('../controllers/userController');
const auctionController = require('../controllers/autionController');
const logController = require('../controllers/logController');

// auth routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// token Middleware
router.use(require('../middleware/tokenChecker'))

const imageStorageFun = multer.diskStorage({
  destination:(req, file, cb)=>{
      console.log('des')
      // feildname=company-logo
      let string = file.fieldname.split("_")
      let dir = "public/" + string[0]
      console.log('before cecking dir')
      // makes directory if it does not exist
      if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
      }
      console.log('after cecking dir')
      cb(null, dir)

      
      // cb(null, "public/org/")
  },
  filename:(req,file,cb)=>{
      console.log('filename')
      let string = file.fieldname.split("_")
      let dir = "public/" + string[0]
      // path.extname returns extension of that file.
      let fileName = file.originalname.replace(path.extname(file.originalname), "")

      // ---->  one way to store file name in database

      // first keep orignalname
      // req.body[string[1]] = fileName + path.extname(file.originalname)
      // let filePath = dir + "/" + req.body[string[1]]
      // // if file exists append date to it
      // if (fs.existsSync(filePath)) {
      //     req.body[string[1]] = fileName + Date.now() + path.extname(file.originalname)
      //     //logger.error("exists:", path);
      // }
      // cb(null, req.body[string[1]]) //Appending extension

      // ---->  another way to store file name in database
      // directly store with date in it
      const randomNumber = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
      req.body[string[1]] = randomNumber + fileName + Date.now() + path.extname(file.originalname)
      cb(null, req.body[string[1]]) //Appending extensions
      // cb(null, fileName + Date.now() + path.extname(file.originalname)) //Appending extension
      
      // cb(null, Date.now()+"-"+file.fieldname+"-"+file.originalname)

  }
})

const uploadImageFun = multer({storage:imageStorageFun})


// aution routes
router.post('/auction/create',uploadImageFun.single('auc_img'), auctionController.create);
router.post('/auction/get', auctionController.read);
router.post('/auction/bidget', auctionController.bidread);
router.post('/auction/participated_auc', auctionController.partAuc);
router.post('/auction/get_participated_auc', auctionController.getPartAuc);
router.post('/auction/update',uploadImageFun.single('auc_img'), auctionController.updateAuc);
router.post('/auction/delete', auctionController.deleteAuc);
router.post('/auction/admindel', auctionController.adminDelAuc);


// log routes
router.post('/log/add', logController.create);
router.post('/log/read', logController.read);

router.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

module.exports = router;
