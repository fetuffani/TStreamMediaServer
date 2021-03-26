import Cors from 'cors'

// Initializing the cors middleware
const cors = Cors({
	methods: ['GET', 'HEAD'],
})


var path = require('path');
var fs = require('fs');

function runMiddleware(req, res, fn) {
	return new Promise((resolve, reject) => {
		fn(req, res, (result) => {
			if (result instanceof Error) {
				return reject(result)
			}

			return resolve(result)
		})
	})
}

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
			{ id: videos.length, path: video }
		)
	});

	return videos;
}

function videos(request, response) {

	runMiddleware(request, response, cors)

	var videos = getVideos();

	response.json({
		status: "ok",
		err: "",
		videos: videos
	});
}

export async function getServerSideProps(context) {

	// set HTTP header
	context.res.setHeader('Access-Control-Allow-Origin', '*:*')

	return {
		props: {}, // will be passed to the page component as props
	}
}

export default videos;