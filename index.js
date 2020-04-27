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
const scrapeTime = "0 * * * * *";
const scrape = new CronJob({
    cronTime: scrapeTime,
    onTick: function () {
        send.send(Twitter);
    },
    start: true
});
const morningTime="0 0 9 * * *"
const healthcheck = new CronJob({
    cronTime:morningTime,
    onTick: function () {
        send.daily(Twitter)
    }
})
scrape.start();
healthcheck.start();
