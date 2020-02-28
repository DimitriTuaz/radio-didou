import React, { useState, useEffect } from 'react'
import { useObserver } from 'mobx-react-lite'
import { Modal, Header, Button, Card, Image, Icon, Dropdown, DropdownProps } from 'semantic-ui-react'

import { OpenAPI } from '@openapi/.';
import { useStore } from '../../hooks'
import { SpotifyScope } from '../../stores';

import { spotify } from '../../../../api_key_public.json'
import { MediaCredentials } from '@openapi/schemas';
import { NowController } from '@openapi/routes'

const spotify_url = 'https://accounts.spotify.com/authorize?response_type=code&show_dialog=true';
const client_id = spotify.client_id;

export const SettingModal = () => {

    const { userStore } = useStore();

    return (
        <React.Fragment>
            <Modal.Header>Mes paramètres</Modal.Header>
            <Modal.Content scrolling>
                <Modal.Description>
                    {(() => {
                        if (userStore.user.power !== undefined
                            && userStore.user.power >= 10) {
                            return (
                                <CredentialDropdown />
                            );
                        }
                    })()}
                    {(() => {
                        if (userStore.user.power !== undefined
                            && userStore.user.power >= 5) {
                            return (
                                <React.Fragment>
                                    <Header>Actuellement...</Header>
                                    <CredentialItem scope={SpotifyScope.playback} />
                                </React.Fragment>
                            );
                        }
                    })()}
                    <Header>
                        Mon compte Spotify
                    </Header>
                    <CredentialItem scope={SpotifyScope.playlist} />
                </Modal.Description>
            </Modal.Content>
        </React.Fragment>
    );
}

const CredentialDropdown = () => {

    const { settingStore } = useStore();

    const defaultOption = {
        key: 'default',
        text: 'Personne',
        value: ''
    };

    const [options, setOptions] = useState([defaultOption]);

    useEffect(() => {
        let opts = settingStore.nowUsers.map((user => {
            return {
                key: user.id !== undefined ? user.id : 'undefined',
                text: user.email,
                value: user.id !== undefined ? user.id : 'undefined'
            }
        }));
        opts = [defaultOption].concat(opts);
        setOptions(opts);
    }, [settingStore.nowUsers]);

    const onChange = async (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        if (data.value !== undefined) {
            let userId: string = data.value.toString();
            await NowController.setMedia(userId);
        }
    }

    return useObserver(() => (
        < Dropdown
            selection
            placeholder='Qui on écoute?'
            options={options}
            onChange={onChange}
        />
    ));
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
        settingStore.obtainCredential(props.scope);
    }

    return useObserver(() => (
        <div>
            {(() => {
                let credentials: MediaCredentials | undefined = settingStore.credentials[props.scope];
                let message: string;
                switch (props.scope) {
                    case SpotifyScope.playback:
                        message = 'The type of device you’re listening on ';
                        break;
                    case SpotifyScope.playlist:
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
