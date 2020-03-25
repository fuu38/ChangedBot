const app = require('./app.js');
const Twit = require('twit');
const CronJob = require('cron').CronJob;
const fs = require('fs');
const line = require('@line/bot-sdk');
const send = require('./send.js');
const Twitter = new Twit({
    consumer_key: app.get('options').key,
    consumer_secret: app.get('options').secret,
    access_token: app.get('options').token,
    access_token_secret: app.get('options').token_secret
})
const LINE = new line.Client({
    channelAccessToken: process.env.LINE_ACCESS_TOKEN
});
const cronTime = "0 * * * * *";

new CronJob({
    cronTime: cronTime,
    onTick: function () {
        send(Twitter,LINE);
    },
    start: true
});

const fs = require('fs');
server.post('/bot/webhook', line.middleware(line_config), (req, res, next) => {
    res.sendStatus(200);
    console.log(req.body);
    req.body.events.forEach((event) => {
        // 参加イベント発生時にグループIDを記録
        if (event.type == "join") {
            const tmp = event.source.groupId;
            console.log("This bot joined :" + groupId);
            if (!fs.existsSync('./groups.csv')) {
                fs.writeFileSync('./groups.csv', groupid);
            }
            else {
                fs.appendFileSync('./groups.csv',  ','+groupid);
            }
        }
    });
});