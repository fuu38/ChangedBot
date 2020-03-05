module.exports = function () {
    var cheerioCli = require('cheerio-httpcli');
    var fs = require('fs');
    cheerioCli.fetch("https://www.toyota-ct.ac.jp/information/feed", {})
        .then(function (result) {
            var TitleList = new Array();
            var LinkList = new Array();
            result.$('title').each(function (i, element) {
                TitleList.push(result.$(element).text());
            })
            result.$('link').each(function (i, element) {
                LinkList.push((result.$(element).text()));
            })
            //一番上はいらんので削除
            TitleList.shift();
            LinkList.shift();
            var json = {
                title: TitleList[0],
                link: LinkList[0]
            }
            fs.writeFileSync('./now.json', JSON.stringify(json));
        })
        .catch(function (err) {
            console.log(err);
        })
        .finally(function () {
            return { title, link };
        });
}