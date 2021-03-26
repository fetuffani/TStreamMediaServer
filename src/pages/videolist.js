import Link from 'next/link';
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card'
import CardDeck from 'react-bootstrap/CardDeck'
import Spinner from 'react-bootstrap/Spinner'


function VideoList() {

	const [videos, setVideos] = useState({ status: "loading", videos: [] });

	useEffect(async () => {
		if (videos.status == "loading") {
			const apiUrl = "http://192.168.15.11:3000/api/videos";
			const fetched = await fetch(apiUrl).then(response => {
				if (response.ok) {
					response.json().then(json => {
						setVideos(json);
					});
				}
			});
		}
	});


	const renderLinks = function () {
		var links = []
		for (let i = 0; i < videos.videos.length; i++) {
			const element = videos.videos[i];
			links.push(
				<div style={{ marginBottom: "15px" }} class="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
						<CardDeck>
							<Card>
								{/* <Card.Img variant="top" src={vthumb} /> */}
								<Card.Body>
									<Card.Title>{element.path.replace(/^.*[\\\/]/, '')}</Card.Title>
									<Card.Text>
										{element.path} 
										<a href={"api/video/" + element.id} class="mt-2 mb-2 btn btn-block">Assistir</a>
									</Card.Text>
								</Card.Body>
							</Card>
						</CardDeck>
				</div>
			)
		}
		return links;
	}



	return (
		<div> { 
			videos.status == "loading" ? <div><Spinner animation="border" variant="light" /></div>
			: <>
				<h1>{Object.keys(videos.videos).length} vídeos</h1>

				<div class="row">
					{renderLinks()}
				</div>
			</>
			}
		</div>
	)
}

export default VideoList