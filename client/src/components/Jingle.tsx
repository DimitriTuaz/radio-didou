import React from 'react';
import '../App.less';

interface IProps {
    display: string,
    src: any
}

interface IState {
}

class Jingle extends React.Component<IProps, IState> {

    audio: HTMLAudioElement = new Audio(this.props.src);

    constructor(props: IProps) {
        super(props);

        this.play = this.play.bind(this);    
    } 

    play() {
        this.audio.play();
    }

    render() {
        const isMobile = window.innerWidth <= 1000;
        return(
            <div>
                <button onClick={this.play} className={'jingles-button' + (isMobile ? '-mobile' : '')}>{this.props.display}</button>
            </div>
        );
    }
}

export default Jingle;