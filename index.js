var app = require('./app.js');
var Twit = require('twit');
var CronJob = require('cron').CronJob;
var fs = require('fs');
var Twitter = new Twit({
    consumer_key: app.get('options').key,
    consumer_secret: app.get('options').secret,
    access_token: app.get('options').token,
    access_token_secret: app.get('options').token_secret
})

var cronTime = "0 * * * * *";

new CronJob({
    cronTime: cronTime,
    onTick: function () {
        tweet();
    },
    start: true
});

function tweet() {
    require('./DetectChanges.js')();
    if(fs.existsSync()) {
        var now = JSON.parse(fs.readFileSync('./now.json', 'utf8'));
        var last = JSON.parse(fs.readFileSync('./last.json', 'utf8'));
        console.log(now, last);
        console.log(now.title, last.title);
        if (now.title !== last.title) {
            var message = "新しい投稿がありました。\n" + now.title + "\n詳しくはこちら\n" + now.link;
            console.log(message)
            Twitter.post('statuses/update', {status: message}, function (err, data, response) {
                if (err) {
                    console.log(err);
                }
            });
        } else {
            console.log("Nothing to tweet now.");
        }
        fs.writeFileSync('./last.json', JSON.stringify(now));
    }
}
