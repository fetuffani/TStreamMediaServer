var path = require('path');
var fs = require('fs');

import { getPics } from '../videos'


process.on('uncaughtException', function (err) {
	console.log('------------ Uncaugth Exception Start');
	console.log(err);
	console.log('------------ Uncaugth Exception End');
});

Array.prototype.findPicIndexById = function (picid) {
	let index = -1;
	if (this.length >= 0) {
		index = this.findIndex(e => e.id == picid);
	}
	return index;
}

function pic(request, response) {

	let params = new URLSearchParams(request.query);
	var searchdir = params.get("dir");
	if (!searchdir) { searchdir = '/'; }
	var pics = getPics(searchdir, false);

	var index = pics.findPicIndexById(request.query.id);
	if (index < 0) {
		response.json({
			status: "error",
			err: "pic id not found",
		});
		return;
	}
	var pic = pics[index];
	var picpath = pic.path;

	try {
		const stat = fs.statSync(picpath);
		const fileSize = stat.size;
		const head = {
			'Content-Length': fileSize,
			'Content-Type': 'image/png',
			'Access-Control-Allow-Origin': '*:*'
		};
		response.writeHead(200, head);
		fs.createReadStream(picpath).pipe(response);
	}
	catch
	{
		response.json({
			status: "error",
			err: "internal error",
		});
	}
}

export default pic;