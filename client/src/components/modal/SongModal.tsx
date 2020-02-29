import React from 'react'
import { useObserver } from 'mobx-react-lite'
import { Modal, List, Image, Button, Icon, Popup } from 'semantic-ui-react'

import { Song } from '@openapi/schemas';
import { useStore } from '../../hooks'

interface SongProps {
    song: Song;
}

export const SongModal = () => {
    return (
        <React.Fragment>
            <Modal.Header style={{ display: 'flex' }}>
                <div style={{ flexGrow: 1, padding: 5 }}>
                    Les chansons que j’aime
                </div>
                <SpotifyButtonDisabled />
            </Modal.Header>
            <Modal.Content scrolling>
                <Modal.Description>
                    <SongList></SongList>
                </Modal.Description>
            </Modal.Content>
        </React.Fragment >
    );
}

const SpotifyButtonDisabled = () => {
    return (
        <Popup
            trigger={
                <div>
                    <Button basic disabled color='blue'>
                        <Icon name='spotify' />
                        Spotify
                    </Button>
                </div>
            }
            header='Synchronisation'
            content="Ajoutez votre compte Spotify dans les paramètres."
            on={['hover']}
        />
    );
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
