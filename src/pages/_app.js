import React from 'react';
import ReactDOM from 'react-dom';

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.scss'

function App({Component, pageProps})
{
	return <Component {...pageProps} />
}

export default App;