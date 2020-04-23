import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { Home } from './pages/Home'
import Jingles from './pages/Jingles'

export default function App() {
  return (
    <Router>
      <div className='full-height'>
        <Switch>
          <Route path="/jingles">
            <Jingles />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
