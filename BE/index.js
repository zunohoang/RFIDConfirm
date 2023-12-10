const express = require('express')
const path = require('path');
const cors = require('cors');
var morgan = require('morgan')
const app = express()
const port = 3000
const router = require('./src/router/index.js')
const connectDB = require('./src/config/connectDB.js')
const fileUpload = require('express-fileupload');
app.use('/static', express.static(path.join(__dirname, 'public')))
connectDB.connect();

app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('combined'));
app.use(cors()); // it enables all cors requests
app.use(fileUpload());

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization");
    next();
});

router(app)


app.listen(port, '0.0.0.0', () => {
    console.log(`Example app listening on port ${port}`)
})