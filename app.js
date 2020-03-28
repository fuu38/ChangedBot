var express = require('express');
var app = express();
const fs = require('fs');
var { Client } = require('pg');
var client = new Client({
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    user: process.env.PSQL_USER,
    port: 5432,
    password: process.env.PSQL_PASSWORD,
})
const line = require('@line/bot-sdk');
const line_config = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN,
    channelSecret: process.env.LINE_SECRET_KEY
};
const LINE = new line.Client(line_config);
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
app.post('/webhook', line.middleware(line_config), (req, res, next) => {
    client.connect();
    const crypto = require('crypto');
    const channelSecret = process.env.LINE_SECRET_KEY; // Channel secret string
    const body = req.body; // Request body string
    const signature = crypto
        .createHmac('SHA256', channelSecret)
        .update(Buffer.from(JSON.stringify(body))).digest('base64');
    if (req.headers['x-line-signature'] === signature) {
        console.log("Validation Succed");
        res.sendStatus(200);
        console.log(req.body);
        req.body.events.forEach((event) => {
            // 参加イベント発生時にグループIDを記録
            if (event.type == "join") {
                const source = event.source;
                const groupId = source.groupId;
                console.log("This bot joined :" + groupId);
                client.query(`INSERT INTO groups (GroupID) VALUES ('${groupId}');`, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    }
    else {
        console.log("Validation Failed");
    }
    client.end();
});
app.listen(app.get('port'), function () {
    console.log('Node app is Running at localhost:' + app.get('port'))
})
module.exports = app;