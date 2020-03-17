import React from 'react';

interface IProps {
    display: string;
    src: string;
}

function Jingle(props: IProps) {
    const audio: HTMLAudioElement = new Audio(props.src);
    const isMobile = window.innerWidth <= 1000;

    return(
        <div>
            <button onClick={() => audio.play()} className={'jingles-button' + (isMobile ? '-mobile' : '')}>{props.display}</button>
        </div>
    )
}

export default Jingle;