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
        const {email, password} = req.body;

        if(email){
            const user = await User.findOne({where: {email: email}});
            if(user){
                if(password === user.password){
                    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '1h'})
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
        const {name, email, password} = req.body
        const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        const validPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
        if(validEmail.test(email)){
            const user = await User.findOne({where: {email: email}});
            if(user){
                res.status(401).json({message: 'Account already exists'})
            }
            else {
                if(validPassword.test(password)){
                    await User.create({name, email, password})
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

module.exports = User