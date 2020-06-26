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

    function work() {
        require('./DetectChanges.js')();
        return Promise.resolve();
    }

    var now;

    work().then(() => { now = JSON.parse(fs.readFileSync('./now.json', 'utf8')); }).then(() => {
        if (fs.existsSync('./last.json')) {
            const last = JSON.parse(fs.readFileSync('./last.json', 'utf8'));
            now.title.forEach(t => {
                if (!last.title.includes(t)) {
                    var message = "「 " + t + " 」\n詳しくはこちら\n" + now.link[now.title.indexOf(t)];

                    Twitter.post('statuses/update', { status: message }, function(err, data, response) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    console.log(message);
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
                                    if (err.statusCode !== "400") {
                                        console.log(err);
                                    }
                                });
                        });
                    }).catch(err => {
                        console.log(err);
                    });
                }
            });
        }
        fs.writeFileSync('./last.json', JSON.stringify(now));
    });
}
module.exports = { send };