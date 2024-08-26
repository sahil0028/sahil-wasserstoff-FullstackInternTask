const User = require('../controllers/userModel')
const bcrypt = require('bcryptjs');
User.findOne({email:"admin@gmail.com"}).then(userData => {
    if(userData==null){
        const password = '123'
        const hashpassword = bcrypt.hashSync(password, 10);
        let userData = {
            name: "Admin",
            email: "admin@gmail.com",
            password: hashpassword,
        }
        let user = new User(userData)
        user.save().then(res => {
            console.log("Admin created")
        }).catch(err => {
            console.log("Admin create err", err)
        })
    }
    else{
        console.log("Admin Already Exists");
    } 
}).catch(err=>{
    console.log("Admin create err", err)
})
   