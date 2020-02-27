import React from 'react'
import { useObserver } from 'mobx-react-lite'
import { Modal, Header, Button, Card, Image, Icon } from 'semantic-ui-react'

import { OpenAPI } from '@openapi/.';
import { useStore } from '../hooks'
import { SpotifyScope } from '../stores';

import { spotify } from '../../../api_key_public.json'
import { MediaCredentials } from '@openapi/schemas';

const spotify_url = 'https://accounts.spotify.com/authorize?response_type=code&show_dialog=true';
const client_id = spotify.client_id;

export const SettingModal = () => {
    const { mainStore } = useStore();

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
                        Actuellement...
                    </Header>
                    <CredentialItem scope={SpotifyScope.playback} />
                    <Header>
                        Mon compte Spotify
                    </Header>
                    <CredentialItem scope={SpotifyScope.playlist} />
                </Modal.Description>
            </Modal.Content>
        </Modal>
    ))
}

interface CredentialItemProps {
    scope: SpotifyScope;
};

const CredentialItem = (props: CredentialItemProps) => {
    const { settingStore } = useStore();

    const onClick = () => {
        (window as any).closeCallback = onClose;
        let left = (window.screen.width - 500) / 2;
        let top = (window.screen.height - 500) / 4;
        window.open(
            spotify_url + '&client_id=' + client_id + '&scope=' + props.scope
            + '&redirect_uri=' + OpenAPI.URL + '/media/1/callback',
            'SpotifyLogin',
            `width=500,height=500,top=${top},left=${left}`);
    }

    const onClose = () => {
        switch (props.scope) {
            case SpotifyScope.playback:
                settingStore.obtainPlaybackCredential();
                break;
            case SpotifyScope.playlist:
                settingStore.obtainPlaylistCredential();
                break;
        }
    }

    return useObserver(() => (
        <div>
            {(() => {
                let credentials: MediaCredentials | undefined = undefined;
                let message: string;
                switch (props.scope) {
                    case SpotifyScope.playback:
                        credentials = settingStore.playbackCredential;
                        message = 'The type of device you’re listening on ';
                        break;
                    case SpotifyScope.playlist:
                        credentials = settingStore.playlistCredential;
                        message = 'Create, edit, and follow playlists.';
                        break;
                }
                if (credentials !== undefined)
                    return (
                        <Card.Group>
                            <Card>
                                <Card.Content>
                                    <Image
                                        floated='right'
                                        size='mini'
                                        src='spotify.png'
                                    />
                                    <Card.Header>{credentials.name}</Card.Header>
                                    <Card.Meta>{credentials.scope}</Card.Meta>
                                    <Card.Description>
                                        {message}
                                    </Card.Description>
                                </Card.Content>
                                <Button attached onClick={() => settingStore.deleteCredential(props.scope)}>
                                    <Icon name='trash' />
                                </Button>
                            </Card>
                        </Card.Group>
                    );
                else
                    return (
                        <Button onClick={onClick}>
                            <Icon name='add' /> Ajouter
                        </Button>
                    );
            })()}
        </div>
    ));
}
