
import React, { useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Toast from 'react-bootstrap/Toast';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Carousel from 'react-bootstrap/Carousel'

import VideoList from './videolist'




const Index = () => (
	<div id="mainwrapper">
		<div id="navbarwrapper">
			<Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
				<Navbar.Brand href="#home">
					TStream
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="mr-auto">
						<Nav.Item as="li"><Nav.Link active>Vídeos</Nav.Link></Nav.Item>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		</div>
		<div id="contentwrapper" class="contentwrapper">
			<VideoList />
		</div>
	</div>
);

export default Index;
