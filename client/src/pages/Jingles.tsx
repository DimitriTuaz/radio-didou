import React from 'react'
import '../App.less';
import Jingle from '../components/Jingle'

interface IProps {
}

interface IState {
}

class Jingles extends React.Component<IProps, IState> {

    componentDidMount() {
        document.title = 'Radio Didou - Jingles';
    }

    render() {
        const isMobile = window.innerWidth <= 1000;
        return (
            <div className='main-container'>
                <div className='title-container-mobile unselectable'>
                    <p className={'sub-title' + (isMobile ? '-mobile' : '')}>Jingles</p>
                </div>
                <div className='jingles-container'>
                    <div className='player-jingles-container'>
                        <Jingle display='Bienvenue au Didou Show' src={require('../sounds/bienvenue-antoine.m4a')} />
                        <Jingle display='Rararadio Didou' src={require('../sounds/rararadio.m4a')} />
                    </div>
                    <div className='player-jingles-container'>
                        <Jingle display='Bienvenue' src={require('../sounds/bienvenue1.mp3')} />
                        <Jingle display='Salut et Bienvenue 1' src={require('../sounds/bienvenue2.mp3')} />
                        <Jingle display='Salut et Bienvenue 2' src={require('../sounds/bienvenue3.mp3')} />
                        <Jingle display='Salut à toi et Bienvenue' src={require('../sounds/bienvenue4.mp3')} />
                    </div>
                    <div className='player-jingles-container'>
                        <Jingle display='Slogan 1' src={require('../sounds/slogan1.mp3')} />
                        <Jingle display='Slogan 2' src={require('../sounds/slogan2.mp3')} />
                    </div>
                    <div className='player-jingles-container'>
                        <Jingle display='Enjaille 1' src={require('../sounds/enjaille1.mp3')} />
                        <Jingle display='Enjaille 2' src={require('../sounds/enjaille2.mp3')} />
                        <Jingle display='Enjaille 3' src={require('../sounds/enjaille3.mp3')} />
                    </div>                    
                </div>
            </div>
        );
    }
}

export default Jingles;
