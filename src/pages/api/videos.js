


var path = require('path');
var fs = require('fs');

function fromDir(startPath, filter) {

	//console.log('Starting from dir '+startPath+'/');

	var rets = []

	if (!fs.existsSync(startPath)) {
		console.log("no dir ", startPath);
		return;
	}

	var files = fs.readdirSync(startPath);
	for (var i = 0; i < files.length; i++) {
		var filename = path.join(startPath, files[i]);
		var stat = fs.lstatSync(filename);
		if (stat.isDirectory()) {
			fromDir(filename, filter).forEach(f => {
				rets.push(f)
			}); //recurse
		}
		else if (filename.endsWith(filter)) {
			//console.log('-- found: ',filename);
			rets.push(filename);
		};
	};

	return rets;
};


export function getVideos() {
	var videofiles = [];
	var dir = 'D:\\Downloads\\';

	// fromDir(dir, '.mkv').forEach(file => {
	// 	videofiles.push(file)
	// });
	// fromDir(dir, '.avi').forEach(file => {
	// 	videofiles.push(file)
	// });
	fromDir(dir, '.mp4').forEach(file => {
		videofiles.push(file)
	});

	var videos = []

	videofiles.forEach(video => {
		videos.push(
			{id: videos.length, path: video}
		)
	});

	return videos;
}



function videos(request, response) {

	var videos = getVideos();



	response.json({
		status:"ok",
		err:"",
		videos: videos
	});
}

export default videos;