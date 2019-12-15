import React from 'react';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="main-container">
      <div className="title-container">
          <p className="title">Radio Didou</p>
      </div>
      <div className="player-container">
        <audio id="player" src="http://37.59.99.228:8889/radio-didou"></audio>
        <button className="icon-sound"><img src="images/icon_play.png" alt=""></img></button>
        <button className="icon-sound" ><img id="icon-mute" src="images/icon_sound.png" alt=""></img></button>
      </div>
    </div>
);
}

export default App;
