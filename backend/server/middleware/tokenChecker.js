const jwt = require('jsonwebtoken')
const secretKey = "this key is safe";

module.exports=(req,res,next)=>{
    const token = req.headers['authorization']
    // console.log('req.body',req.headers['userid'])
    const userId = req.headers['userid']
    // console.log('in token',token.length>0)
    if(token){
        jwt.verify(token,secretKey,(err,decoded)=>{
            // console.log('in token if-',decoded,)
            // console.log('in token if using id-',req.headers['userid'])
            if(err || decoded?._id!=req.headers['userid']){
                return res.status(403).send({
                    sucess:false,
                    status:410,
                    message:'wrong token',
                })
            }
            next()
        })
    }else{
        return res.send({
            sucess:false,
            status:410,
            message:'No token found'
        })
    }
    // jwt.verify(token,secretKey)
}
