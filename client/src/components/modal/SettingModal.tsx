import React, { useState, useEffect } from 'react'
import { useObserver } from 'mobx-react-lite'
import { Modal, Header, Button, Card, Image, Icon, Dropdown, DropdownProps, DropdownItemProps, Segment } from 'semantic-ui-react'

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
                    {(userStore.user.power !== undefined && userStore.user.power >= 10) &&
                        <CredentialDropdown />
                    }
                    {(userStore.user.power !== undefined && userStore.user.power >= 5) &&
                        <React.Fragment >
                            <Header>Actuellement...</Header>
                            <CredentialItem scope={SpotifyScope.playback} />
                        </React.Fragment>
                    }
                    <Header>
                        Mon compte Spotify
                    </Header>
                    <CredentialItem scope={SpotifyScope.playlist} />
                </Modal.Description>
            </Modal.Content>
        </React.Fragment >
    );
}

const CredentialDropdown = () => {

    const defaultOption: DropdownItemProps = {
        key: 'none',
        text: 'Personne',
        value: 'none'
    };

    const { settingStore } = useStore();
    const [options, setOptions] = useState([defaultOption]);
    const [value, setValue] = useState();
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        let opts = settingStore.nowUsers.map((user => {
            return {
                key: user.id,
                text: user.email,
                value: user.id
            }
        }));
        setValue('');
        setOptions([defaultOption].concat(opts));
    }, [settingStore.nowUsers]);

    const handleChange = (e: any, data: DropdownProps) => {
        setDisabled(false);
        setValue(data.value);
    }

    const onClick = async () => {
        try {
            await NowController.setMedia(value);
            setValue('');
            setDisabled(true);
        }
        catch (error) {
            console.error(error);
        }
    }

    return useObserver(() => (
        <React.Fragment>
            {settingStore.nowUsers.length > 0 &&
                <React.Fragment>
                    <Dropdown
                        onChange={handleChange}
                        options={options}
                        placeholder='Qui on écoute?'
                        selection
                        value={value}
                    />
                    <Button
                        style={{ marginLeft: 10 }}
                        onClick={onClick}
                        disabled={disabled}>
                        <Icon attached name='paper plane' />
                    </Button>
                </React.Fragment>
            }
        </React.Fragment >
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
            spotify_url
            + '&client_id=' + client_id
            + '&scope=' + props.scope
            + '&redirect_uri=' + OpenAPI.URL + '/media/1/callback',
            'SpotifyLogin',
            `width=500,height=500,top=${top},left=${left}`
        );
    }

    const onClose = () => {
        settingStore.obtainCredential(props.scope);
        if (props.scope == SpotifyScope.playback)
            settingStore.obtainNowUsers();
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
                                <Button attached onClick={
                                    () => settingStore.deleteCredential(props.scope)
                                }>
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
