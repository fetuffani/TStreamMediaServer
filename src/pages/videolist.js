import Link from 'next/link';
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card'
import CardDeck from 'react-bootstrap/CardDeck'
import Spinner from 'react-bootstrap/Spinner'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import LazyLoad from 'react-lazyload'



function VideoList() {

	const [videos, setVideos] = useState({ status: "loading", videos: [] });
	const [dir, setDir] = useState('/');


	useEffect(async () => {
		if (videos.status == "loading") {
			const apiUrl = "/api/videos?dir=" + dir;
			const fetched = await fetch(apiUrl).then(response => {
				if (response.ok) {
					response.json().then(json => {
						setVideos(json);
					});
				}
			});
		}
	}, [videos, dir]);

	const changePath = function (path, goBack) {
		setDir((goBack ? path : dir + path));
		setVideos({ status: "loading", videos: [] });
	}

	const renderDirLinks = function () {
		var links = []
		var split = dir.split("/");
		var updir = split.slice(0, split.length - 2).join("/") + "/";
		links.push(
			<ListGroup.Item id="btn-voltar" action onClick={() => { { changePath(updir, true) } }}>Voltar</ListGroup.Item>
		)
		for (let i = 0; i < videos.dirs.length; i++) {
			const element = videos.dirs[i];
			links.push(
				<ListGroup.Item action onClick={() => { { changePath(element.path, false) } }}>{element.path}</ListGroup.Item>
			)
		}
		return <div id="linksdiv"><ListGroup>{links}</ListGroup></div>;
	}

	const renderVideoLinks = function () {
		var links = []
		for (let i = 0; i < videos.videos.length; i++) {
			const element = videos.videos[i];
			const paths = element.path.split('\\');
			// const pathelems = []
			// paths.forEach(p => {pathelems.push(<p>-- {p}</p>)})
			// pathelems.reverse();
			links.push(
				<div style={{ marginBottom: "15px" }} class="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
					<CardDeck>
						<Card>
							{/* <Card.Img variant="top" src={vthumb} /> */}
							<Card.Body>
								<Card.Title>{element.path.replace(/^.*[\\\/]/, '')}</Card.Title>
								<Card.Text>
									{/* {pathelems}  */}
									<a href={"api/video/" + element.id + "?dir=" + dir} class="mt-2 mb-2 btn btn-block" target="_blank">Assistir</a>
								</Card.Text>
							</Card.Body>
						</Card>
					</CardDeck>
				</div>
			)
		}
		return links;
	}

	const renderPicsLinks = function () {
		var links = []
		for (let i = 0; i < videos.pics.length; i++) {
			const element = videos.pics[i];
			const paths = element.path.split('\\');
			// const pathelems = []
			// paths.forEach(p => {pathelems.push(<p>-- {p}</p>)})
			// pathelems.reverse();
			links.push(
				<div style={{ marginBottom: "15px" }} class="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
					<CardDeck>
						<Card>
							<LazyLoad>
								<a href={"api/pic/" + element.id + "?dir=" + dir} target="_blank">
									<Card.Img variant="top" src={"api/pic/" + element.id + "?dir=" + dir} />
								</a>
							</LazyLoad>
						</Card>
					</CardDeck>
				</div>
			)
		}
		return links;
	}



	return (
		<div> {
			videos.status == "loading" ? <div style={{ marginTop: "15px" }}><Spinner animation="border" variant="light" /></div>
				: <>
					<h6>Directory: {dir}</h6>

					<div class="row">
						{renderDirLinks()}
					</div>

					<div class="row">
						{renderVideoLinks()}
					</div>

					<div class="row">
						{renderPicsLinks()}
					</div>
				</>
		}
		</div>
	)
}

export default VideoList