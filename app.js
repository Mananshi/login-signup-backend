const express = require( 'express')
const bodyParser = require( 'body-parser')
const cors = require( 'cors')
const mongoose = require( 'mongoose')
const User = require( './models/User')

const app = express()
// const port = process.env.PORT || 3000
const port = 80


const corsOptions = {
    origin: 'https://636536229e7c820062d21e9e--heartfelt-salmiakki-6260ce.netlify.app/',
    credentials: true,
}
app.use(cors(corsOptions))

// the mongodb url is supposed to be saved in an env file. This is only for demo purposes

mongoose.connect('mongodb+srv://superadmin:9UG2hm6YuUbzSqL@cluster0.f4vccnn.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});

// Configuring body parser middleware
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.get('/details', async (req, res) => {
    try{
        const user = await user.find({});
        res.send(user);
    }
    catch(err){
        console.log(err);
    }
})

app.listen(port, () => console.log(`Hello world app listening on port ${port}`))