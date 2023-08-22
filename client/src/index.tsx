import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'semantic-ui-less/semantic.less'
import App from './App';
import * as serviceWorker from './serviceWorker';

import { OpenAPI } from '@openapi/.';
import { ConfigurationController } from '@openapi/routes'
import { ConfigContext } from './contexts'
import { Configuration } from '@openapi/schemas';

// CONFIGURATION
OpenAPI.URL = window.location.origin;
export const ConfigurationCtx = React.createContext({});

//RENDER
ConfigurationController.getConfiguration()
    .then(configuration => {
        ReactDOM.render(
            <ConfigContext.Provider value={configuration as Configuration}>
                <App />
            </ConfigContext.Provider>,
            document.getElementById('root')
        );
    })

serviceWorker.unregister();
