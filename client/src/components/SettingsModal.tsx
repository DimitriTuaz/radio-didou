import React from 'react'
import { useObserver } from 'mobx-react-lite'
import { Modal, Header, Button } from 'semantic-ui-react'

import { OpenAPI } from '@openapi/.';
import { useStore } from '../hooks'

const spotify_url = 'https://accounts.spotify.com/authorize?response_type=code&show_dialog=true';
const client_id = '776060114a8f49acbdd04a5d6c719c4e';
const scope = 'user-read-playback-state';

export const SettingsModal = () => {
    const { mainStore } = useStore();

    const onClick = () => {
        (window as any).closeCallback = onClose;
        let left = (window.screen.width - 500) / 2;
        let top = (window.screen.height - 500) / 4;
        window.open(
            spotify_url + '&client_id=' + client_id + '&scope=' + scope
            + '&redirect_uri=' + OpenAPI.URL + '/now/1/callback',
            'SpotifyLogin',
            `width=500,height=500,top=${top},left=${left}`);
    }

    const onClose = () => {
        console.log('lol!');
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
                    <Button onClick={onClick}>
                        Ajouter un compte
                    </Button>
                </Modal.Description>
            </Modal.Content>
        </Modal>
    ))
}
