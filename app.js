import express  from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/details', (req, res) => {
    res.send({data: 'Hello World, from express'});
});

app.listen(port, () => console.log(`Hello world app listening on http://localhost:${port}`))