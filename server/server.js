var express = require('express');
var app = express();
var port = process.env.PORT || 5000;

//body-parser turns the response body into an object
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true})); //req.body won't work without this

//access the router
var sweaterRouter = require('./routes/sweater_router.js');
app.use('/sweater', sweaterRouter);

//share static files located in the public folder
app.use(express.static('server/public'));

//start the server
app.listen(port, function () {
    console.log('server running on port:', port);
});