var path = require('path');
var fs = require('fs');

import { getVideos } from '../videos'


process.on('uncaughtException', function (err) {
	console.log('------------ Uncaugth Exception Start');
	console.log(err);
	console.log('------------ Uncaugth Exception End');
});

Array.prototype.findVideoIndexById = function (videoid) {
	let index = -1;
	if (this.length >= 0) {
		index = this.findIndex(e => e.id == videoid);
	}
	return index;
}

function video(request, response) {

	let params = new URLSearchParams(request.query);
	var searchdir = params.get("dir");
	if (!searchdir) { searchdir = '/'; }
	var videos = getVideos(searchdir, false);

	var index = videos.findVideoIndexById(request.query.id);
	if (index < 0) {
		response.json({
			status: "error",
			err: "video id not found",
		});
		return;
	}
	var video = videos[index];
	var videpath = video.path;
	// console.log(videpath)

	try {
		const stat = fs.statSync(videpath);
		const fileSize = stat.size;
		const range = request.headers.range;

		if (range) {
			const parts = range.replace(/bytes=/, "").split("-");
			const start = parseInt(parts[0], 10);
			const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
			const chunksize = (end - start) + 1;
			const file = fs.createReadStream(videpath, { start, end });
			const head = {
				'Content-Range': `bytes ${start}-${end}/${fileSize}`,
				'Accept-Ranges': 'bytes',
				'Content-Length': chunksize,
				'Content-Type': 'video/mp4',
				'Access-Control-Allow-Origin': '*:*'
			};
			response.writeHead(206, head);
			file.pipe(response);
		} else {
			const head = {
				'Content-Length': fileSize,
				'Content-Type': 'video/mp4',
				'Access-Control-Allow-Origin': '*:*'
			};
			response.writeHead(200, head);
			fs.createReadStream(videpath).pipe(response);
		}
	}
	catch
	{
		response.json({
			status: "error",
			err: "internal error",
		});
	}
}

export default video;