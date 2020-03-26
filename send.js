module.exports = function () {
    const fs = require('fs');
    const csv = require('csv');
    const app = require('./app.js');
    const line = require('@line/bot-sdk');
    const line_config = {
        channelAccessToken: process.env.LINE_ACCESS_TOKEN,
        channelSecret: process.env.LINE_SECRET_KEY
    };
    const Twit = require('twit');
    const LINE = new line.Client(line_config);
    const Twitter = new Twit({
        consumer_key: app.get('options').key,
        consumer_secret: app.get('options').secret,
        access_token: app.get('options').token,
        access_token_secret: app.get('options').token_secret
    });
    require('./DetectChanges.js')();
    if (fs.existsSync('./now.json')) {
        var now = JSON.parse(fs.readFileSync('./now.json', 'utf8'));
        var last = JSON.parse(fs.readFileSync('./last.json', 'utf8'));
        console.log(now, last);
        console.log(now.title, last.title);
        if (now.title !== last.title) {
            //まずTwitterに投稿
            var message = "「 " + now.title + " 」\n詳しくはこちら\n" + now.link;
            Twitter.post('statuses/update', { status: message }, function (err, data, response) {
                if (err) {
                    console.log(err);
                }
            });
            console.log(message)
            const options = {
                type: 'text',
                text: message
            };
            if (fs.existsSync('./groups.csv')) {
                const groups = fs.readFileSync('./groups.csv').pipe(csv.parse());
                groups.forEach((id) => {
                    client.pushMessage(id, options)
                        .then(() => {
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                });
            }
        } else {
            console.log("Nothing to send now.");
        }
        fs.writeFileSync('./last.json', JSON.stringify(now));
    }
}
