const app = require('./app.js');
const Twit = require('twit');
const CronJob = require('cron').CronJob;
const fs = require('fs');
const line = require('@line/bot-sdk');
const express = require('express');
const server = express();
const line_config = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN,
    channelSecret: process.env.LINE_SECRET_KEY
};
const LINE = new line.Client(line_config);
const cronTime = "0 * * * * *";

new CronJob({
    cronTime: cronTime,
    onTick: function () {
        require('./send.js')();
    },
    start: true
});
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