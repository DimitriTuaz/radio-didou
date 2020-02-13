import React, { useState, useEffect } from 'react'
import { useObserver } from 'mobx-react-lite'
import { useStores } from '../hooks/UseStores'
import { Dimmer, Loader, Menu, Segment, Sidebar, Icon, Image, List, Button } from 'semantic-ui-react'
import '../App.less';
import icon_play from '../images/icon_play.png'
import icon_heart from '../images/icon_heart.png'
import icon_heart_outline from '../images/icon_heart_outline.png'
import icon_sound from '../images/icon_sound.png'
import icon_sound_low from '../images/icon_sound_low.png'
import icon_mute from '../images/icon_mute.png'
import { UserModal } from '../components/UserModal'
import { UserState } from '../stores/UserStore'
import { SongState } from '../stores/SongStore'

import * as config from '../../../config.json'
import { Song } from '@openapi/schemas';

const LOOPBACK_URL: string = config.loopback
const ICECAST_URL: string = config.icecast
const STREAM_URL: string = ICECAST_URL + '/radio-didou';

interface IProps {
}

export const Home = (props: IProps) => {
  const { commonStore, mainStore, userStore, songStore } = useStores();
  const [mute, setMute] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [volume, setVolume] = useState(1);
  const [audio] = useState(new Audio());

  useEffect(() => {
    mainStore.getCurrentTrack();
    mainStore.currentTrackIntervalId = window.setInterval(mainStore.getCurrentTrack, 3000);
    audio.onplaying = onPlaying;
    userStore.cookieLogin();

    return () => {
      clearInterval(mainStore.currentTrackIntervalId);
    };
  });

  const onPlaying = () => {
    setPlaying(true);
    setLoading(false);
  }

  const onPlay = () => {
    setPlaying(true);
    setLoading(true);
    audio.src = '';
    audio.src = STREAM_URL;
    audio.load();
    audio.play();
  };

  const onMute = () => {
    audio.muted = !mute;
    setMute(!mute)
  };

  const onLike = async () => {
    switch (songStore.state) {
      case SongState.liked:
        await songStore.remove(mainStore.trackUrl, mainStore.trackUrl);
        break;
      case SongState.unliked:
        await songStore.add(mainStore.trackUrl);
        break;
    }
  }

  const onLikeListShow = async () => {
    mainStore.showSidebar(false)
    await songStore.get();
    mainStore.showLikeList(true);
  }

  const onChangeVolume = (event: React.FormEvent<HTMLInputElement>) => {
    audio.volume = parseFloat(event.currentTarget.value);
    setVolume(parseFloat(event.currentTarget.value))
  };

  const isMobile = window.innerWidth <= 1000;
  return useObserver(() => (
    <div style={{ height: '100vh', display: 'flex', flexFlow: 'column nowrap' }}>
      <div style={{ flex: 1 }}>
        <Sidebar.Pushable as={Segment}>
          <Sidebar
            as={Menu}
            animation='overlay'
            icon='labeled'
            direction='right'
            inverted
            vertical
            visible={mainStore.sidebarVisible}
            width='thin'
            color='blue'
          >
            <Menu.Item as='a' onClick={() => mainStore.showSidebar(false)}>
              <Icon name='angle right' />
            </Menu.Item>
            <Menu.Item as='a' onClick={() => {
              if (commonStore.userState === UserState.signup) {
                commonStore.userState = UserState.login;
              }
              mainStore.showLoginModal(true);
            }}>
              <Icon name='user' />
            </Menu.Item>
            {
              commonStore.userState === UserState.connected &&
              <Menu.Item as='a' onClick={() => onLikeListShow()}>
                <Icon name='heart' />
              </Menu.Item>
            }
            <Menu.Item as='a' onClick={() => { window.open(LOOPBACK_URL + '/jingles', '_blank') }}>
              <Icon name='announcement' />
            </Menu.Item>
            <Menu.Item as='a' onClick={() => { window.open('https://ign.radio-didou.com') }}>
              <Icon name='compass' />
            </Menu.Item>
          </Sidebar>
          <Sidebar
            as={Menu}
            animation='overlay'
            icon='labeled'
            direction='right'
            inverted
            vertical
            visible={mainStore.likeListVisible}
            width='wide'
            color='blue'
          >
            <Menu.Item as='a' onClick={() => mainStore.showLikeList(false)}>
              <Icon name='angle right' />
            </Menu.Item>
            <List divided verticalAlign='middle'>
              {
              songStore.songs.map((song: Song) => {
                return (
                  <List.Item>
                  <List.Content floated='right'>
                    <div onClick={() => songStore.remove(mainStore.trackUrl, song.url)}>
                      <Icon name='trash alternate' size='large'></Icon>
                    </div>
                  </List.Content>
                  <div onClick={() => window.open(song.url)}>
                  <Image floated='left' avatar src={song.artwork} />
                  <List.Content floated='left'>{song.title}</List.Content>
                  </div>
                </List.Item>
                )
              })
              }
            </List>
          </Sidebar>
          <Sidebar.Pusher>
            <Segment basic>
              <Dimmer active={playing && loading}>
                <Loader className='unselectable'>Chargement...</Loader>
              </Dimmer>
              <UserModal></UserModal>
              <div className='main-container'>
                <div className='header-container'>
                  <div className={'title-container' + (isMobile ? '-mobile' : '') + ' unselectable'}>
                    <p className={'title' + (isMobile ? '-mobile' : '')}>Radio Didou</p>
                  </div>
                  <div className={'settings-container'}>
                    <Icon
                      name='bars'
                      color='teal' // teal is the new white
                      size='big'
                      onClick={() => mainStore.showSidebar(true)} >
                    </Icon>
                  </div>
                </div>
                <div className={'player-container' + (isMobile ? '-mobile' : '')}>
                  <button className={'icon-sound' + (isMobile ? '-mobile' : '')} onClick={onPlay}>
                    <img src={icon_play} alt=''></img>
                  </button>
                  {
                    commonStore.userState === UserState.connected &&
                    <button
                      className={'icon-sound' + (isMobile ? '-mobile' : '')}
                      onClick={onLike}>
                      <img src={songStore.state === SongState.liked ? icon_heart : icon_heart_outline} alt=''></img>
                    </button>
                  }
                  <button className={'icon-sound' + (isMobile ? '-mobile' : '')} onClick={onMute}>
                    <img src={mute ? icon_mute : (volume > 0.5 ? icon_sound : icon_sound_low)} alt=''></img>
                  </button>
                  <div className={'volume-slider-wrapper' + (isMobile ? '-mobile' : '')}>
                    <input
                      min={0}
                      max={1}
                      onChange={onChangeVolume}
                      step='any'
                      type='range'
                      value={volume}
                    />
                  </div>
                </div>

                <div className={'track-container'}>
                  <div className={'track-clickable' + (isMobile ? '-mobile' : '')} onClick={() => { window.open(mainStore.trackUrl, '_blank') }}>
                    <div className='track-cover-container' >
                      <img className={'track-cover' + (isMobile ? '-mobile' : '')} src={mainStore.trackCover} alt=''></img>
                    </div>
                    <div className={'track-infos-container' + (isMobile ? '-mobile' : '')}>
                      <p className={'track-title' + (isMobile ? '-mobile' : '')}>{mainStore.trackTitle}</p>
                      <p className={'track-artists' + (isMobile ? '-mobile' : '')}>{mainStore.trackArtists}</p>
                      <p className={'track-album' + (isMobile ? '-mobile' : '')}>{mainStore.trackAlbum}</p>
                    </div>
                  </div>
                </div>

                <div className='current-listeners-container unselectable'>
                  <p className={'current-listeners' + (isMobile ? '-mobile' : '')}>
                    {mainStore.auditorCount === undefined ? '' : mainStore.auditorCount + ' auditeur' + (mainStore.auditorCount > 1 ? 's' : '') + ' actuellement'}
                  </p>
                </div>
              </div>
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    </div>
  ))
};
