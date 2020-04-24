const app = require('./app.js');
const Twit = require('twit');
const CronJob = require('cron').CronJob;
const line = require('@line/bot-sdk');
const send = require('./send.js');
const Twitter = new Twit({
    consumer_key: app.get('options').key,
    consumer_secret: app.get('options').secret,
    access_token: app.get('options').token,
    access_token_secret: app.get('options').token_secret
})
const line_config = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN,
    channelSecret: process.env.LINE_SECRET_KEY
};
const LINE = new line.Client(line_config);
const cronTime = "0 * * * * *";

new CronJob({
    cronTime: cronTime,
    onTick: function () {
        send.send(Twitter);
    },
    start: true
});
new CronJob({
    cronTime: "0 0 10 * * *",
    onTick: function () {
        send.daily(Twitter)
    }
})
