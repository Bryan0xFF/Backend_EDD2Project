const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


mongoose.connect("mongodb+srv://Bryan0xFF:abcde54321@cluster0-oexhj.mongodb.net/test?retryWrites=true",{useNewUrlParser: true});
const userRoutes = require('./api/routes/users');
const messageRoutes = require('./api/routes/messages');

limit = 52428800;
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));


app.use(bodyParser.json());
mongoose.set('useCreateIndex', true);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    //Default options si se envia un POST o PUT
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/users', userRoutes);
app.use('/messages', messageRoutes);

app.use((req, res, next) => {
    const error = new Error('not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
     res.json({
         error: {
            message: error.message
         }
     });
});

module.exports = app;