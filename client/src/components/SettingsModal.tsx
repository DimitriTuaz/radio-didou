import React, { useEffect } from 'react'
import { useObserver } from 'mobx-react-lite'
import { Modal, Header, Button, Card, Image, Icon } from 'semantic-ui-react'

import { OpenAPI } from '@openapi/.';
import { useStore } from '../hooks'
import { SettingStore } from '../stores';

import { spotify } from '../../../api_key_public.json'

const spotify_url = 'https://accounts.spotify.com/authorize?response_type=code&show_dialog=true';
const client_id = spotify.client_id;

export const SettingsModal = () => {
    const { mainStore, userStore, settingStore } = useStore();

    useEffect(() => {
        (window as any).closeCallback = onClose;
        settingStore.obtainPlaybackCredential();
        settingStore.obtainPlaylistCredential();
    }, [settingStore, userStore.user.id]);

    const onClose = () => {
        settingStore.obtainPlaybackCredential();
        settingStore.obtainPlaylistCredential();
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
                    <CredentialItem />
                </Modal.Description>
            </Modal.Content>
        </Modal>
    ))
}

const CredentialItem = () => {
    const { userStore, settingStore } = useStore();

    const onClick = () => {
        let left = (window.screen.width - 500) / 2;
        let top = (window.screen.height - 500) / 4;
        window.open(
            spotify_url + '&client_id=' + client_id + '&scope=' + SettingStore.scope_playlist
            + '&redirect_uri=' + OpenAPI.URL + '/media/1/callback'
            + '&state=' + userStore.user.id,
            'SpotifyLogin',
            `width=500,height=500,top=${top},left=${left}`);
    }

    return useObserver(() => (
        <div>
            {settingStore.playlistCredential !== undefined &&
                <Card.Group>
                    <Card>
                        <Card.Content>
                            <Image
                                floated='right'
                                size='mini'
                                src='spotify.png'
                            />
                            <Card.Header>{settingStore.playlistCredential.name}</Card.Header>
                            <Card.Meta>{settingStore.playlistCredential.scope}</Card.Meta>
                            <Card.Description>
                                Create, edit, and follow playlists.
                        </Card.Description>
                        </Card.Content>
                        <Button attached onClick={settingStore.deletePlaylistCredential}>
                            <Icon name='trash' />
                        </Button>
                    </Card>
                </Card.Group>
            }
            {settingStore.playlistCredential === undefined &&
                <Button onClick={onClick}>
                    <Icon name='add' /> Ajouter
            </Button>
            }
        </div>
    ));
}
