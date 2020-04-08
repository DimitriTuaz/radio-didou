import React, { useState, useContext } from 'react'
import { useObserver } from 'mobx-react-lite'
import {
    Modal,
    Header,
    Button,
    Card,
    Image,
    Icon,
    Dropdown,
    Segment,
    Checkbox,
    CheckboxProps,
    Form
} from 'semantic-ui-react'


import { OpenAPI } from '@openapi/.';
import { MediaCredentials, User, NowState } from '@openapi/schemas';

import { useStore } from '../../hooks'
import { SpotifyScope, UserPower, NowEnum } from '../../stores';
import { ConfigContext } from '../../contexts';
import { NowController } from '@openapi/routes';

const spotify_url = 'https://accounts.spotify.com/authorize?response_type=code&show_dialog=true';

export const SettingModal = () => {

    const { userStore } = useStore();

    return (
        <React.Fragment>
            <Modal.Header>Mes paramètres</Modal.Header>
            <Modal.Content scrolling>
                <Modal.Description>
                    {userStore.user.power >= UserPower.ADMIN &&
                        <React.Fragment>
                            <Header>
                                Gestion...
                            </Header>
                            <CredentialDropdown />
                            <Header>
                                Mode DJ...
                            </Header>
                            <LiveCheckbox />
                        </React.Fragment>
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

const LiveCheckbox = () => {

    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false);

    const { settingStore } = useStore();

    const handleChange = async (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {
        if (data.checked !== undefined && data.checked) {
            await settingStore.obtainNowState();
            setOpen(true);
        } else {
            await NowController.setDefaultState();
            await settingStore.obtainNowState();
        }
    }

    const handleClick = async () => {
        try {
            await settingStore.setNowState({
                type: NowEnum.Live,
                song: settingStore.nowState.song,
                artist: settingStore.nowState.artist,
                album: settingStore.nowState.album,
                url: settingStore.nowState.url
            });
            setError(false);
            setOpen(false);
        }
        catch (error) {
            setError(true);
            console.error(error);
        }
    }

    return useObserver(() => (
        <React.Fragment>
            <Modal open={open}
                closeOnDimmerClick={true}
                onClose={() => { setOpen(false) }}
                size='tiny'>
                <Modal.Header>Gère ton live.</Modal.Header>
                <Modal.Content>
                    <Form error={error}>
                        <Form.Field>
                            <label>Titre de la session</label>
                            <Form.Input placeholder='Coronight III'
                                value={settingStore.nowState.song}
                                onChange={(e) => { settingStore.nowState.song = e.currentTarget.value }}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>DJ</label>
                            <Form.Input placeholder='DJ Didou'
                                value={settingStore.nowState.artist}
                                onChange={(e) => { settingStore.nowState.artist = e.currentTarget.value }}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Information</label>
                            <Form.Input placeholder='Ce soir 22h - 2h'
                                value={settingStore.nowState.album}
                                onChange={(e) => { settingStore.nowState.album = e.currentTarget.value }}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>URL</label>
                            <Form.Input placeholder='https://zoom.us/'
                                value={settingStore.nowState.url}
                                onChange={(e) => { settingStore.nowState.url = e.currentTarget.value }}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button icon='check' content='Valider' onClick={handleClick} />
                </Modal.Actions>
            </Modal>
            <div>
                <Segment style={{ display: "inline-block" }}
                    compact>
                    <Checkbox toggle
                        checked={settingStore.nowState.type === NowEnum.Live}
                        onChange={handleChange}
                    />
                </Segment>
                <Button disabled={settingStore.nowState.type !== NowEnum.Live}
                    onClick={async () => {
                        await settingStore.obtainNowState();
                        setOpen(true);
                    }}
                    icon='edit'
                    size='big'
                    basic
                    style={{ display: "inline-block", marginLeft: "10px" }} />
            </div>

        </React.Fragment >
    ));
}

const CredentialDropdown = () => {

    const { settingStore } = useStore();
    const [error, setError] = useState(false);

    const defaultOptions: NowState[] = [
        { type: NowEnum.None, name: 'Aucun' }
    ];

    const options = defaultOptions.concat(
        settingStore.nowUsers.map((user: User) =>
            ({ type: NowEnum.Spotify, name: user.email, userId: user.id })
        )
    );

    const color = (state: NowState) => {
        if (state.type === NowEnum.None)
            return 'grey'
        else
            return 'blue';
    }

    const onClick = async (state: NowState) => {
        try {
            await settingStore.setNowState(state);
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
                        text='Qui on écoute ?'
                        icon='music'
                        error={error}
                        floating
                        labeled
                        button
                        className='icon'>
                        <Dropdown.Menu>
                            <Dropdown.Header icon='user circle' content='Compte Radio-didou' />
                            <Dropdown.Divider />
                            {options.map((state) => (
                                <Dropdown.Item
                                    label={{ color: color(state), empty: true, circular: true }}
                                    key={state.userId !== undefined ? state.userId : state.name}
                                    text={state.name}
                                    onClick={() => onClick(state)}
                                    active={(() => {
                                        if (settingStore.nowState !== undefined) {
                                            if (settingStore.nowState.userId !== undefined)
                                                return state.userId === settingStore.nowState.userId;
                                            else
                                                return state.type === settingStore.nowState.type;
                                        }
                                        return state.type === NowEnum.None
                                    })()} />
                            ))}
                        </Dropdown.Menu>
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
