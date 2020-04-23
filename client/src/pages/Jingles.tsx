import React, { useEffect } from 'react'
import '../App.less';
import '../Jingles.less'
import Jingle from '../components/jingle/Jingle'

function Jingles() {
    useEffect(() => {
        document.title = 'Radio Didou - Jingles';
    });

    const isMobile = window.innerWidth <= 1000;
    return (
        <div className='main-container'>
            <div className='main-jingles-container'>
                <div className='title-container-mobile unselectable'>
                    <p className={'sub-title' + (isMobile ? '-mobile' : '')}>Jingles</p>
                </div>
                <div className='jingles-container'>
                    <p className={'jingles-section' + (isMobile ? '-mobile' : '')}>Antoine & Jos'</p>
                    <div className='player-jingles-container'>
                        <Jingle display='Bienvenue au Didou Show' src={require('../sounds/antetjos/didou_show.mp3')} />
                        <Jingle display='Rararadio Didou' src={require('../sounds/antetjos/rararadio.mp3')} />
                    </div>
                    <p className={'jingles-section' + (isMobile ? '-mobile' : '')}>Tim</p>
                    <div className='player-jingles-container'>
                        <Jingle display='Bienvenue' src={require('../sounds/tim/bienvenue3.mp3')} />
                        <Jingle display='Salut et Bienvenue 1' src={require('../sounds/tim/bienvenue2.mp3')} />
                        <Jingle display='Salut et Bienvenue 2' src={require('../sounds/tim/bienvenue1.mp3')} />
                        <Jingle display='Salut à toi et Bienvenue' src={require('../sounds/tim/bienvenue4.mp3')} />
                    </div>
                    <div className='player-jingles-container'>
                        <Jingle display='Slogan 1' src={require('../sounds/tim/slogan1.mp3')} />
                        <Jingle display='Slogan 2' src={require('../sounds/tim/slogan2.mp3')} />
                    </div>
                    <div className='player-jingles-container'>
                        <Jingle display='Enjaille 1' src={require('../sounds/tim/enjaille1.mp3')} />
                        <Jingle display='Enjaille 2' src={require('../sounds/tim/enjaille2.mp3')} />
                        <Jingle display='Enjaille 3' src={require('../sounds/tim/enjaille3.mp3')} />
                    </div>
                    <p className={'jingles-section' + (isMobile ? '-mobile' : '')}>Romain</p>
                    <div className='player-jingles-container'>
                        <Jingle display='Il est 8 heures' src={require('../sounds/romain/8_heures.mp3')} />
                        <Jingle display='Café croissant' src={require('../sounds/romain/cafe_croissant.mp3')} />
                        <Jingle display='Réveil' src={require('../sounds/romain/reveil.mp3')} />
                        <Jingle display='Vous êtes bien' src={require('../sounds/romain/vous_etes_bien.mp3')} />

                    </div>
                    <div className='player-jingles-container'>
                        <Jingle display='Ondes du bonheur 1' src={require('../sounds/romain/ondes.mp3')} />
                        <Jingle display='Ondes du bonheur 2' src={require('../sounds/romain/ondes2.mp3')} />
                        <Jingle display='Ondes du bonheur 3' src={require('../sounds/romain/ondes3.mp3')} />
                        <Jingle display='20 ans' src={require('../sounds/romain/20_ans.mp3')} />
                    </div>
                    <div className='player-jingles-container'>
                        <Jingle display='Vie douce 1' src={require('../sounds/romain/vie_douce.mp3')} />
                        <Jingle display='Vie douce 2' src={require('../sounds/romain/vie_douce2.mp3')} />
                        <Jingle display='Pluie partout 1' src={require('../sounds/romain/pluie.mp3')} />
                        <Jingle display='Pluie partout 2' src={require('../sounds/romain/pluie2.mp3')} />
                    </div>
                    <div className='player-jingles-container'>
                        <Jingle display='Pas par hasard...' src={require('../sounds/romain/hasard.mp3')} />
                        <Jingle display='Good vides' src={require('../sounds/romain/good_vibes.mp3')} />
                        <Jingle display='Que des solutions' src={require('../sounds/romain/solutions.mp3')} />
                        <Jingle display='Saumon' src={require('../sounds/romain/saumon.mp3')} />
                    </div>
                    <div className='player-jingles-container'>
                        <Jingle display='Range ton PC' src={require('../sounds/romain/range_pc.mp3')} />
                        <Jingle display='Excel' src={require('../sounds/romain/excel.mp3')} />
                    </div>
                    <p className={'jingles-section' + (isMobile ? '-mobile' : '')}>Didou</p>
                    <div className='player-jingles-container'>
                        <Jingle display='Réveil' src={require('../sounds/didou/reveil.mp3')} />
                        <Jingle display='Café croissant' src={require('../sounds/didou/cafe_croissant.mp3')} />
                        <Jingle display='Bouchons' src={require('../sounds/didou/bouchons.mp3')} />
                    </div>
                    <div className='player-jingles-container'>
                        <Jingle display='Vous êtes bien 1' src={require('../sounds/didou/vous_etes_bien.mp3')} />
                        <Jingle display='Vous êtes bien 2' src={require('../sounds/didou/vous_etes_bien2.mp3')} />
                        <Jingle display='Vous écoutez' src={require('../sounds/didou/ecoutez.mp3')} />
                        <Jingle display='Pas par hasard...' src={require('../sounds/didou/hasard.mp3')} />
                    </div>
                    <div className='player-jingles-container'>
                        <Jingle display='Change de mood 1' src={require('../sounds/didou/change_mood.mp3')} />
                        <Jingle display='Change de mood 2' src={require('../sounds/didou/change_mood2.mp3')} />
                        <Jingle display='Autre époque' src={require('../sounds/didou/autre_epoque.mp3')} />
                        <Jingle display='On se régale' src={require('../sounds/didou/regale.mp3')} />
                    </div>
                    <div className='player-jingles-container'>
                        <Jingle display='Tu aimes la musique' src={require('../sounds/didou/aime_musique.mp3')} />
                        <Jingle display='Dedieu !' src={require('../sounds/didou/dedieu.mp3')} />
                        <Jingle display='Funk' src={require('../sounds/didou/funk1.mp3')} />
                        <Jingle display='Rock' src={require('../sounds/didou/rock1.mp3')} />
                    </div>
                    <div className='player-jingles-container'>
                        <Jingle display='20 ans' src={require('../sounds/didou/20_ans.mp3')} />
                        <Jingle display='Que des solutions' src={require('../sounds/didou/solutions.mp3')} />
                        <Jingle display='Ce son est pour toi' src={require('../sounds/didou/son_pour_toi.mp3')} />
                        <Jingle display='Ta soirée' src={require('../sounds/didou/ta_soiree.mp3')} />
                    </div>
                    <div className='player-jingles-container'>
                        <Jingle display='Antoine' src={require('../sounds/didou/antoine.mp3')} />
                        <Jingle display='PDT' src={require('../sounds/didou/pdt.mp3')} />
                        <Jingle display='Loys' src={require('../sounds/didou/loys.mp3')} />
                        <Jingle display='JB' src={require('../sounds/didou/jb.mp3')} />
                    </div>
                    <div className='player-jingles-container'>
                        <Jingle display='Laure' src={require('../sounds/didou/laure.mp3')} />
                        <Jingle display='Romain' src={require('../sounds/didou/romain.mp3')} />
                        <Jingle display='Toby' src={require('../sounds/didou/tobias.mp3')} />
                        <Jingle display='Charlou' src={require('../sounds/didou/charlou.mp3')} />
                    </div>
                    <p className={'jingles-section' + (isMobile ? '-mobile' : '')}>Bruitages</p>
                    <div className='player-jingles-container'>
                        <Jingle display='Verre servi' src={require('../sounds/sound_effects/glass.mp3')} />
                        <Jingle display='Bouteille dévissé' src={require('../sounds/sound_effects/bottle.mp3')} />
                        <Jingle display='Canette' src={require('../sounds/sound_effects/canette.mp3')} />
                        <Jingle display='Gorgées' src={require('../sounds/sound_effects/drink.mp3')} />
                    </div>
                    <div className='player-jingles-container'>
                        <Jingle display='Braguette' src={require('../sounds/sound_effects/zipper.mp3')} />
                        <Jingle display='Schlako Mako' src={require('../sounds/sound_effects/smoke.mp3')} />
                        <Jingle display='Allumettes' src={require('../sounds/sound_effects/matches.mp3')} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Jingles;
