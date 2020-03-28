function send(Twitter) {
    const fs = require('fs');
    var { Client } = require('pg');
    var client = new Client({
        host: process.env.PSQL_HOST,
        database: process.env.PSQL_DATABASE,
        user: process.env.PSQL_USER,
        port: 5432,
        password: process.env.PSQL_PASSWORD,
    })
        client.connect();
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
            var groups;
            client.query('SELECT GroupID FROM groups', (err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    groups = result.rows;
                }
            });
            console.log(groups);
            groups.forEach((id) => {
                console.log(id.groupid);
                LINE.pushMessage(id.groupid, options)
                    .then(() => {
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });
        } else {
            console.log("Nothing to send now.");
        }
        fs.writeFileSync('./last.json', JSON.stringify(now));
    }
    client.end();
}

module.exports = {
    send
}