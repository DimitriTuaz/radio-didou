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

serviceWorker.unregister();
