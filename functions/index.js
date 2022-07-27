'use strict';
/** EXPORT ALL FUNCTIONS
 */
const glob = require("glob");
const camelCase = require("camelcase");
const files = glob.sync('./**/*.f.js', { cwd: __dirname, ignore: './node_modules/**' });
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });
admin.initializeApp();

/**
 * Here we're using Gmail to send 
 */
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'metrohousetaipei@gmail.com',
        pass: 'lrwaxvvpmumhkwfw'
    }
});

exports.sendMail = functions.https.onRequest((req, res) => {
    cors(req, res, () => {

        // getting dest email by query string
        const dest = req.query.dest;
        const house = req.query.house || '無';
        const username = req.query.username || '無';
        const url = req.query.url;
        const storageRef = req.query.stref;
        const dataRef = req.query.dataref;


        const mailOptions = {
            from: '大都會物業房務管理系統 <metrohousetaipei@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
            to: dest,
            subject: '大都會物業邀請電子簽約', // email subject
            html: '<p style="font-size: 16px;">親愛的' + username + '房客您好,</p>' +
                '<br />' +
                '<p style="font-size: 16px;">您與我們承租' + house + '，麻煩您至下方連結電子簽約，感謝您！ </p>' +
                '<br />' +
                '<b style="font-size: 16px;">注意！連結將於一天內失效！ </b>' +
                '<br />' +
                '<p style="font-size: 16px;">' + url + "?stref=" + storageRef + "&dataref=" + dataRef + ' </p>'

            // email content in HTML
        };

        // returning result
        return transporter.sendMail(mailOptions, (erro, info) => {
            if (erro) {
                return res.send(erro.toString());
            }
            return res.send('Sended');
        });
    });
});

exports.sendAsiaMail = functions.region('asia-east1').https.onRequest((req, res) => {
    cors(req, res, () => {

        // getting dest email by query string
        const dest = req.query.dest;
        const house = req.query.house || '無';
        const username = req.query.username || '無';
        const url = req.query.url;
        const storageRef = req.query.stref;
        const dataRef = req.query.dataref;


        const mailOptions = {
            from: '大都會物業房務管理系統 <metrohousetaipei@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
            to: dest,
            subject: '大都會物業邀請電子簽約', // email subject
            html: '<p style="font-size: 16px;">親愛的' + username + '房客您好,</p>' +
                '<br />' +
                '<p style="font-size: 16px;">您與我們承租' + house + '，麻煩您至下方連結電子簽約，感謝您！ </p>' +
                '<br />' +
                '<b style="font-size: 16px;">注意！連結將於一天內失效！ </b>' +
                '<br />' +
                '<p style="font-size: 16px;">' + url + "?stref=" + storageRef + "&dataref=" + dataRef + ' </p>'

            // email content in HTML
        };

        // returning result
        return transporter.sendMail(mailOptions, (erro, info) => {
            if (erro) {
                return res.send(erro.toString());
            }
            return res.send('Sended');
        });
    });
});

exports.sendCleanHouseMail = functions.https.onRequest((req, res) => {
    cors(req, res, () => {

        // getting dest email by query string
        const dest = req.query.dest;
        const house = req.query.house || '無';
        const username = req.query.username || '無';
        const deadline = req.query.deadline || '無';

        const mailOptions = {
            from: '大都會物業房務管理系統 <metrohousetaipei@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
            to: dest,
            subject: '大都會物業房務清潔工作', // email subject
            html: '<p style="font-size: 16px;">親愛的' + username + '員工您好,</p>' +
                '<br />' +
                '<p style="font-size: 16px;">您被指派至' + house + '進行清潔打掃工作，請於' + deadline + '完成，感謝您！ </p>' +
                '<br />' +
                '<p style="font-size: 16px;">詳細資訊請登入大都會物業網站：http://taipeimetrohouse.web.app/tasks.html' + '</p>'

        };

        // returning result
        return transporter.sendMail(mailOptions, (erro, info) => {
            if (erro) {
                return res.send(erro.toString());
            }
            return res.send('Sended');
        });
    });
});
exports.sendFinishCleanMail = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        const house = req.query.house || '無';
        const finshdate = req.query.finishdate || '無';

        const mailOptions = {
            from: '大都會物業房務管理系統 <metrohousetaipei@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
            to: "metrohousetaipei@gmail.com",
            subject: house + "於" + finshdate + "清潔完成", // email subject
            html: '<p style="font-size: 16px;">提醒管理員們，' + house + '已完成清潔工作，請於網站點選確認</p>' +
                '<br />' +
                '<p style="font-size: 16px;">詳細資訊請登入大都會物業網站：http://taipeimetrohouse.web.app/cleanhouse.html' + '</p>'
        };

        // returning result
        return transporter.sendMail(mailOptions, (erro, info) => {
            if (erro) {
                return res.send(erro.toString());
            }
            return res.send('Sended');
        });
    });
});

exports.sendInviteMail = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        const dest = req.query.dest;

        const mailOptions = {
            from: '大都會物業房務管理系統 <metrohousetaipei@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
            to: dest,
            subject: '大都會物業邀請您的加入', // email subject
            html: '<p style="font-size: 16px;">您好,</p>' +
                '<br />' +
                '<p style="font-size: 16px;">本公司為了增進工作效率以及管理，目前使用新的網站作為管理系統。該系統會寄發工作通知信，並提醒您每日需要完成的事項，麻煩請您先登入系統，感謝您！</p>' +
                '<p style="font-size: 16px;">大都會物業網站：https://taipeimetrohouse.web.app/login.html' + '</p>'
        };

        // returning result
        return transporter.sendMail(mailOptions, (erro, info) => {
            if (erro) {
                return res.send(erro.toString());
            }
            return res.send('Sended');
        });
    });
});


exports.sendContractFinishMail = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        const house = req.query.house;
        const room = req.query.room;
        // const url = req.query.url;

        const mailOptions = {
            from: '大都會物業房務管理系統 <metrohousetaipei@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
            to: "metrohousetaipei@gmail.com",
            subject: '大都會物業-' + house + room + '契約更改', // email subject
            html: '<p style="font-size: 16px;">管理員您好,</p>' +
                '<br />' +
                '<p style="font-size: 16px;">' + house + room + '的契約已編輯後儲存，詳細資訊請至以下連結確認：</p>' +
                '<p style="font-size: 16px;">網站連結： http://taipeimetrohouse.web.app/ </p>'
        };

        // returning result
        return transporter.sendMail(mailOptions, (erro, info) => {
            if (erro) {
                return res.send(erro.toString());
            }
            return res.send('Sended');
        });
    });
});





for (let f = 0, fl = files.length; f < fl; f++) {
    const file = files[f];
    const functionName = camelCase(file.slice(0, -5).split('/').join('_')); // Strip off '.f.js'
    if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === functionName) {
        exports[functionName] = require(file);
    }
}