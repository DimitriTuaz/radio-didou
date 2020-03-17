import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'semantic-ui-less/semantic.less'
import App from './App';
import * as serviceWorker from './serviceWorker';

import { OpenAPI } from '@openapi/.';
const config = require('../../config.json');

if (config.loopback !== undefined) {
    OpenAPI.URL = config.loopback;
}
else {
    OpenAPI.URL = window.location.origin;
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
