import Cors from 'cors'

// Initializing the cors middleware
const cors = Cors({
	methods: ['GET', 'HEAD'],
})


var path = require('path');
var fs = require('fs');
var regex = new RegExp("^\\D*([0-9]{1,9}).+$");
var rootdir = 'D:\\Downloads\\';

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
	var dir = rootdir;
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

	var regex = new RegExp("^\\D*([0-9]{1,9}).+$")

	videos.sort((v1,v2) => { return orderByFirstNumberinString(v1,v2); });

	return videos;
}

export function getPics(searchdir, searchSubFolders) {
	var videofiles = [];
	var dir = rootdir;
	dir = path.join(dir,searchdir);

	if (!fs.existsSync(dir))
	{
		return [];
	}

	// fromDir(dir, '.mkv').forEach(file => {
	// 	videofiles.push(file)
	// });
	fromDir(dir, '.jpg').forEach(file => {
		videofiles.push(file)
	});
	fromDir(dir, '.png', searchSubFolders).forEach(file => {
		videofiles.push(file);
	});

	var videos = []

	videofiles.forEach(video => {
		videos.push(
			{ id: videos.length, path: video }
		)
	});

	var regex = new RegExp("^\\D*([0-9]{1,9}).+$")

	videos.sort((v1,v2) => { return orderByFirstNumberinString(v1,v2); });

	return videos;
}

function orderByFirstNumberinString(v1,v2)
{
	var f1 = path.parse(v1.path).base;
	var f2 = path.parse(v2.path).base;
	var r1 = regex.exec(f1);
	var r2 = regex.exec(f2);
	var o1 = r1 && r1.length >= 2 ? r1[1] : 2;
	var o2 = r2 && r2.length >= 2 ? r2[1] : 1;
	return o1-o2;
}

export function getDirs(searchdir) {
	var founddirs = [];
	var dir = rootdir;
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

	dirs.sort((v1,v2) => { return orderByFirstNumberinString(v1,v2); });

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
	var pics = getPics(searchdir);

	response.json({
		status: "ok",
		err: "",
		searchdir: searchdir,
		dirs: dirs,
		videos: videos,
		pics: pics,
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