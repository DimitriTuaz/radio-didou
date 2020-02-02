import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'semantic-ui-less/semantic.less'
import App from './App';
import * as serviceWorker from './serviceWorker';
import { MainStore } from './stores/mainStore';
import { StoreProvider } from './pages/Home';

const mainStore = new MainStore();

ReactDOM.render(
    <StoreProvider value={mainStore}>
        <App />
    </StoreProvider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
