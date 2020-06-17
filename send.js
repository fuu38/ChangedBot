function send(Twitter) {
    const fs = require('fs');
    const pg = require('pg');
    const pool = new pg.Pool({
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
    require('./DetectChanges.js')();
    if (fs.existsSync('./last.json')) {
        var now = JSON.parse(fs.readFileSync('./now.json', 'utf8'));
        var last = JSON.parse(fs.readFileSync('./last.json', 'utf8'));
        if (now.link === "https://www.toyota-ct.ac.jp/information/23786/") {
            //毎回こいつを上に持ってくるのでこいつはスキップ
            return
        }
        if (now.title !== last.title) {
            //まずTwitterに投稿
            var message = "「 " + now.title + " 」\n詳しくはこちら\n" + now.link;
            Twitter.post('statuses/update', { status: message }, function(err, data, response) {
                if (err) {
                    console.log(err);
                }
            });
            console.log(message)
            const options = {
                type: 'text',
                text: message
            };
            const p_options = {
                rowMode: 'array',
                text: 'SELECT DISTINCT GroupID FROM groups'
            }
            pool.query(p_options).then((result) => {
                //LINE送信はじめ
                result.rows.map(r => r[0]).forEach(groupid => {
                    console.log(groupid);
                    LINE.pushMessage(groupid, options)
                        .then(() => {})
                        .catch((err) => {
                            console.log(err);
                        });
                });
            }).catch(err => {
                console.log(err);
            });
        }
        fs.writeFileSync('./last.json', JSON.stringify(now));
    }
}
module.exports = {
    send
}