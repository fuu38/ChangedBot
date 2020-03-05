var express = require('express');
var app = express();


var options = {
    key: process.env.CONSUMER_KEY,
    secret: process.env.CONSUMER_SECRET,
    token: process.env.ACCESS_KEY,
    token_secret: process.env.ACCESS_SECRET
};
app.set('options', options);
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function (request, response) {
    response.send('Twitter Bot is Running!');
})
app.listen(app.get('port'), function () {
    console.log('Node app is Running at localhost:' + app.get('port'))
})
module.exports = app;