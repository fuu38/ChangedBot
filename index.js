const app = require('./app.js');
const Twit = require('twit');
const CronJob = require('cron').CronJob;
const fs = require('fs');
const express = require('express');
const server = express();
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
const pg = require('pg');
const pool = new pg.Pool({
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    user: process.env.PSQL_USER,
    port: 5432,
    password: process.env.PSQL_PASSWORD,
});
pool.query('SELECT DISTINCT GroupID FROM groups').then((err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        return result;
    }
}).then((result) => {
    try {
        console.log(result);
        console.log(result.Result.rows);
    }
    catch (err) {
        console.log(err);
    }
});
new CronJob({
    cronTime: cronTime,
    onTick: function () {
        send.send(Twitter);
    },
    start: true
});
