const fs = require('fs');
const config = require('./config');
const request = require('request');
const wxGetTokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + config.APPID + '&secret=' + config.SECRET;
const axios = require('axios');

let token = null;
const getToken = function() {
	return new Promise((resolve, reject) => {
		const now = new Date();
		if (token && (new Date() - token.timestamp) / 3600 < 2) {
			resolve(token);
		} else {
			return axios.get(wxGetTokenUrl).then((res) => {
				res.data.timestamp = new Date();
				token = res.data;
				resolve(res.data);
			}).catch((err) => {
				reject(err)
			});
		}
	});
}

const getQRcode = function() {
	axios({
		method: 'POST',
		url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + token.access_token,
		data: {
			scene: '需要的参数'
		},
		responseType:'stream'
	}).then((res) => {
		console.log('res:', res.data);
		res.data.pipe(fs.createWriteStream('Qcode.png'));
	});
}

getToken().then(() => {
	getQRcode();
});