import React, { useEffect } from 'react'
import { useObserver } from 'mobx-react-lite'
import { Modal, Header, Button } from 'semantic-ui-react'

import { OpenAPI } from '@openapi/.';
import { useStore } from '../hooks'

import { spotify } from '../../../api_key_public.json'

const spotify_url = 'https://accounts.spotify.com/authorize?response_type=code&show_dialog=true';
const scope_playback = 'user-read-playback-state';
const scope_playlist = 'playlist-modify-public';
const client_id = spotify.client_id;

export const SettingsModal = () => {

    const { mainStore, userStore, settingStore } = useStore();

    useEffect(() => {
        settingStore.obtainPlaybackCredential();
        settingStore.obtainPlaylistCredential();
    }, [userStore.user.id]);

    const onClick = () => {
        (window as any).closeCallback = onClose;
        let left = (window.screen.width - 500) / 2;
        let top = (window.screen.height - 500) / 4;
        window.open(
            spotify_url + '&client_id=' + client_id + '&scope=' + scope_playlist
            + '&redirect_uri=' + OpenAPI.URL + '/now/1/callback'
            + '&state=' + userStore.user.id,
            'SpotifyLogin',
            `width=500,height=500,top=${top},left=${left}`);
    }

    const onClose = () => {

    }

    return useObserver(() => (
        <Modal
            open={mainStore.settingsModalVisible}
            closeOnDimmerClick={true}
            onClose={() => mainStore.showSettingsModal(false)}
            closeIcon >
            <Modal.Header>Mes paramètres</Modal.Header>
            <Modal.Content scrolling>
                <Modal.Description>
                    <Header>
                        Mon compte Spotify
                    </Header>
                    {settingStore.playlistCredential !== undefined &&
                        settingStore.playbackCredential?.name
                    }
                    {settingStore.playlistCredential === undefined &&
                        <Button onClick={onClick}>
                            Ajouter un compte
                        </Button>
                    }
                </Modal.Description>
            </Modal.Content>
        </Modal>
    ))
}
