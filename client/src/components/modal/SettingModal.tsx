import React, { useState, useContext } from 'react'
import { useObserver } from 'mobx-react-lite'
import { Modal, Header, Button, Card, Image, Icon, Dropdown } from 'semantic-ui-react'

import { OpenAPI } from '@openapi/.';
import { useStore } from '../../hooks'
import { SpotifyScope, UserPower, NowEnum } from '../../stores';

import { MediaCredentials, User, NowState } from '@openapi/schemas';
import { NowController } from '@openapi/routes'

import { ConfigContext } from '../../contexts';

const spotify_url = 'https://accounts.spotify.com/authorize?response_type=code&show_dialog=true';

export const SettingModal = () => {

    const { userStore } = useStore();

    return (
        <React.Fragment>
            <Modal.Header>Mes paramètres</Modal.Header>
            <Modal.Content scrolling>
                <Modal.Description>
                    {userStore.user.power >= UserPower.ADMIN &&
                        <CredentialDropdown />
                    }
                    {userStore.user.power >= UserPower.DJ &&
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

    const { settingStore } = useStore();
    const [error, setError] = useState(false);

    const defaultOptions: NowState[] = [
        { type: NowEnum.None, name: 'Aucun' },
        { type: NowEnum.Live, name: 'DJ Set' }
    ];

    const options = defaultOptions.concat(
        settingStore.nowUsers.map((user: User) =>
            ({ type: NowEnum.Spotify, name: user.email, userId: user.id })
        )
    );

    const onClick = async (state: NowState) => {
        try {
            NowController.setMedia(state);
            settingStore.nowState = state;
            setError(false);
        }
        catch (error) {
            setError(true);
            console.error(error);
        }
    }

    return useObserver(() => (
        <React.Fragment>
            {settingStore.nowUsers.length > 0 &&
                <React.Fragment>
                    <Dropdown
                        selection
                        text='Qui on écoute?'
                        error={error}
                        item
                        options={options.map((state) => (
                            <Dropdown.Item
                                key={state.userId !== undefined ? state.userId : state.name}
                                text={state.name}
                                onClick={() => onClick(state)}
                                active={(() => {
                                    if (settingStore.nowState !== undefined) {
                                        if (settingStore.nowState.userId !== undefined)
                                            return state.userId === settingStore.nowState.userId;
                                        else
                                            return state.name === settingStore.nowState.name;
                                    }
                                    return state.name === 'Aucun'
                                })()} />
                        ))}>
                    </Dropdown>
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

    const config = useContext(ConfigContext);

    const onClick = () => {
        (window as any).closeCallback = onClose;
        let left = (window.screen.width - 500) / 2;
        let top = (window.screen.height - 500) / 4;

        window.open(
            spotify_url
            + '&client_id=' + config.spotify_id
            + '&scope=' + props.scope
            + '&redirect_uri=' + OpenAPI.URL + '/media/1/callback',
            'SpotifyLogin',
            `width=500,height=500,top=${top},left=${left}`
        );
    }

    const onClose = () => {
        settingStore.obtainCredential(props.scope);
        if (props.scope === SpotifyScope.playback)
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
