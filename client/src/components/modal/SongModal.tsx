import React, { useState } from 'react'
import { useObserver } from 'mobx-react-lite'
import { Modal, List, Image, Button, Icon, Popup } from 'semantic-ui-react'

import { Song } from '@openapi/schemas';
import { useStore } from '../../hooks'
import { SongController } from '@openapi/routes';
import { SpotifyScope } from '../../stores';

export const SongModal = () => {

    return (
        <React.Fragment>
            <Modal.Header style={{ display: 'flex' }}>
                <div style={{ flexGrow: 1, padding: 5 }}>
                    Les chansons que j’aime
                </div>
                <SpotifyButton />
            </Modal.Header>
            <Modal.Content scrolling>
                <Modal.Description>
                    <SongList></SongList>
                </Modal.Description>
            </Modal.Content>
        </React.Fragment >
    );
}

const SpotifyButton = () => {

    const { settingStore } = useStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const onClick = async () => {
        try {
            setLoading(true);
            await SongController.synchronize();
            setError(false);
            setLoading(false);
        } catch (error) {
            setError(true);
            setLoading(false);
            console.error(error);
        }
    }

    return useObserver(() => (
        <Popup
            basic
            trigger={
                <div style={{ marginRight: 5 }}>
                    <Button
                        onClick={onClick}
                        loading={loading}
                        disabled={
                            settingStore.credentials[SpotifyScope.playlist] == undefined
                        }
                        basic
                        color={error ? 'red' : 'blue'} >
                        <Icon name='spotify' />
                        Spotify
                </Button>
                </div>
            }
            header='Synchronisation'
            content={(() => {
                if (error)
                    return 'Une erreur est survenue.'
                else if (settingStore.credentials[SpotifyScope.playlist] == undefined)
                    return 'Ajoutez votre compte Spotify dans les paramètres.'
                else
                    return 'Synchroniser les chansons avec votre compte.'
            })()}
            on={['hover']}
        />
    ));
}

interface SongProps {
    song: Song;
}

const SongItem = (props: SongProps) => {
    const { songStore } = useStore();

    return (
        <List.Item>
            <Image
                floated='left'
                avatar src={props.song.artwork}
                onClick={() => window.open(props.song.url)} />
            <List.Content
                onClick={() => window.open(props.song.url)} >
                <List.Header as='a'>{props.song.title}</List.Header>
                <List.Description as='a'>
                    {props.song.artist}
                    <i>({props.song.album})</i>
                </List.Description>
            </List.Content>
            <List.Content
                floated='right'
                onClick={() => songStore.remove(props.song.url)}>
                <List.Icon name='trash alternate' size='large' verticalAlign='middle' />
            </List.Content>
        </List.Item>
    )
}

const SongList = () => {
    const { songStore } = useStore();

    return useObserver(() => (
        <List divided relaxed>
            {songStore.songs.map((song: Song) => {
                return (
                    <SongItem song={song} key={song.url} />
                )
            })}
        </List>
    ))
}
