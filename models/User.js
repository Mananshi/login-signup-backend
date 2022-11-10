const Sequelize = require('sequelize');
const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
        // isLoggedIn: {
        //     type: Sequelize.BOOLEAN,
        //     allowNull: false,
        //     defaultValue: false
        // }
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
        const body = req.body;

        if(body.email){
            const user = await User.findOne({where: {email: body.email}});
            if(user){
                const correctPassword = await bcrypt.compare(body.password, user.password)
                if(correctPassword){
                    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '1h'})
                    await User.update({isLoggedIn: true}, {where: {email: body.email}})
                    res.status(200).json({token})
                }
                else{
                    res.status(401).json({message: 'Incorrect password'})
                }
            }
            else {
                res.status(401).json({message: 'User doesn\'t exist'})
            }
        } else {
            res.status(401).json({message: 'Invalid email'})
        }
    } catch(err){
        console.log(err)
        res.status(500).json({message: "Internal Server Error"})
    }
}

User.signupUser = async (req, res) => {
    try{
        const body = req.body
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(body.password, salt)
        console.log(hashedPassword)
        const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        const validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
        if(validEmail.test(body.email)){
            const user = await User.findOne({where: {email: body.email}});
            if(user){
                res.status(401).json({message: 'Account already exists'})
            }
            else {
                if(validPassword.test(body.password)){
                    await User.create({
                        name: body.name, 
                        email: body.email, 
                        password: hashedPassword})
                    res.status(200).json({message: 'Account created'})
                }
                else {
                    res.status(401).json({message: 'Password must contain at least 6 characters, one uppercase, one lowercase, one number and one special character'})
                }
                }
        }
        else{
            res.status(401).json({message: 'Please enter a valid email'})
        }
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: "Internal Server Error"})
    }

}

User.logoutUser = async (req, res) => {
    const body = req.body
    try{
        await User.update({isLoggedIn: body.isLoggedIn}, {where: {email: req.body.email}})
        
        res.status(200).json({message: 'Logged out'})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: "Internal Server Error"})
    }
}

module.exports = User