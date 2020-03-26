function send(Twitter) {
    const fs = require('fs');
    const line = require('@line/bot-sdk');
    const line_config = {
        channelAccessToken: process.env.LINE_ACCESS_TOKEN,
        channelSecret: process.env.LINE_SECRET_KEY
    };
    const LINE = new line.Client(line_config);
    const csvParser = require('csv-parse/lib/sync');
    require('./DetectChanges.js')();
    if (fs.existsSync('./last.json')) {
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
                const groups = csvParser(fs.readFileSync('./groups.csv'));
                console.log(groups);
                groups.forEach((id) => {
                    console.log(id[0]);
                    LINE.pushMessage(id[0], options)
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

module.exports = {
    send
}