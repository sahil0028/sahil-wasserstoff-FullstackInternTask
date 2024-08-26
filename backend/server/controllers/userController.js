// const express = require('express');
// const router = express.Router();
const userModel = require('./userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = "this key is safe";

const register =  async(req, res) => {
    try {
        if (!req.body.name || !req.body.email || !req.body.password){
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const { name, email, password } = req.body;
        let user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const hashpassword = bcrypt.hashSync(password, 10);
        user = new userModel({ name, email, password:hashpassword });
        const savedUser = await user.save();
        return res.status(201).send({
            message: 'User created successfully',
            data: savedUser,
        });
    } catch (error) {
        console.log(error);
      return res.status(500).json({ message: 'Error creating user' });
    }
}

const login = async (req, res) => {
    try {
        // console.log(req.body);
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        // console.log(user);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        if (!user.status) {
            return res.status(400).json({ message: 'User is not active, contact admin' });
        }
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = {
            _id: user._id,
            name: user.name,
            email: user.email,
        };
        const token = jwt.sign(payload, secretKey, { expiresIn: '6h' });

        return res.status(200).json({ 
            message: 'Login successful',
            token: token,
            data: user });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Error logging in' });
    }
}

module.exports = {register,login,};

