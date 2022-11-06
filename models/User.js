const Sequelize = require('sequelize');
const db = require('../db');
const jwt = require('jsonwebtoken');

const User = db.define('users', 
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
    },
    {timestamps: false}
);

const run = async() => {
    await User.sync()
};

(function(){
    run()
})();


User.loginUser = async (req, res) => {
    try{
        const {email, password} = req.body
        const validEmail = /^[a-zA-Z0-9.! #$%&'*+/=? ^_`{|}~-]+@[a-zA-Z0-9-]+(?:\. [a-zA-Z0-9-]+)*$/
        if(validEmail.test(email)){
            const user = await User.findOne({where: {email: email}})
            console.log(user)
            if(user){
                if(password === user.password){
                    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '1h'})
                    res.status(200).json({token})
                }
                else{
                    res.status(401).json({message: 'Wrong password'})
                }
            }
            else {
                res.status(401).json({message: 'Wrong email'})
            }
        } else {
            res.status(401).json({message: 'Invalid email'})
        }
    } catch(err){
        console.log(err)
        res.status(500).json({messege: "Internal Server Error"})
    }
}

User.signupUser = async (req, res) => {
    try{
        const {name, email, password} = req.body
        const user = await User.create({name, email, password})

        return res.status(201).json({message: 'User created successfully'})
    }
    catch(err){
        console.log(err)
        res.status(500).json({messege: "Internal Server Error"})
    }

}
module.exports = User