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

function fromDir(startPath, filter, searchSubFolders) {

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
		if (stat.isDirectory() && searchSubFolders) {
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


export function getVideos(searchdir, searchSubFolders) {
	var videofiles = [];
	var dir = 'D:\\Downloads\\';
	dir = path.join(dir,searchdir);

	if (!fs.existsSync(dir))
	{
		return [];
	}

	// fromDir(dir, '.mkv').forEach(file => {
	// 	videofiles.push(file)
	// });
	// fromDir(dir, '.avi').forEach(file => {
	// 	videofiles.push(file)
	// });
	fromDir(dir, '.mp4', searchSubFolders).forEach(file => {
		videofiles.push(file);
	});

	var videos = []

	videofiles.forEach(video => {
		videos.push(
			{ id: videos.length, path: video }
		)
	});

	return videos;
}

export function getDirs(searchdir) {
	var founddirs = [];
	var dir = 'D:\\Downloads\\';
	dir = path.join(dir,searchdir);

	if (!fs.existsSync(dir))
	{
		return [];
	}

	// fromDir(dir, '.mkv').forEach(file => {
	// 	videofiles.push(file)
	// });
	// fromDir(dir, '.avi').forEach(file => {
	// 	videofiles.push(file)
	// });
	var folders = fs.readdirSync(dir);
	folders.forEach(folder => {
		var stat = fs.lstatSync(path.join(dir,folder));
		if (stat.isDirectory()) {
			founddirs.push(folder+"/")
		}
	});


	var dirs = []

	founddirs.forEach(folder => {
		dirs.push(
			{ id: dirs.length, path: folder }
		)
	});

	return dirs;
}

function videos(request, response) {

	runMiddleware(request, response, cors)

	let params = new URLSearchParams(request.query);
	var searchdir = params.get("dir");
	if (!searchdir) { searchdir = '/'; }

	//Object.keys(request.query).forEach((prop)=> console.log(prop));

	var videos = getVideos(searchdir, false);
	var dirs = getDirs(searchdir);

	response.json({
		status: "ok",
		err: "",
		searchdir: searchdir,
		dirs: dirs,
		videos: videos,
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