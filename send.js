function send(Twitter, LINE) {
    const fs = require('fs');
    const csv = require('csv');
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
            const groups = fs.readFileSync('./groups.csv').pipe(csv.parse());
            groups.forEach((id) => {
                client.pushMessage(id, options)
                    .then(() => {
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
        } else {
            console.log("Nothing to send now.");
        }
        fs.writeFileSync('./last.json', JSON.stringify(now));
    }
}

module.exports = {
    send
}