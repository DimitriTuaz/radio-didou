import React from 'react'
import { useObserver } from 'mobx-react-lite'
import { useStores } from '../hooks/UseStores'
import { Modal, List, Image } from 'semantic-ui-react'
import { Song } from '@openapi/schemas';

interface IProps {
    song: Song;
}

function SongItem(props: IProps) {
    const { mainStore, songStore } = useStores();

    return(
        <List.Item>
            <Image floated='left' avatar src={props.song.artwork} onClick={() => window.open(props.song.url)} className='song-item'/>
            <List.Content onClick={() => window.open(props.song.url)} className='song-item'>
                <List.Header as='a'>{props.song.title}</List.Header>
                <List.Description as='a'>{props.song.artist} <i>({props.song.album})</i></List.Description>
            </List.Content>
            <List.Content floated='right' onClick={() => songStore.remove(mainStore.trackUrl, props.song.url)} className='song-item'>
                <List.Icon name='trash alternate' size='large' verticalAlign='middle'/>
            </List.Content>
        </List.Item>
    )
}

function SongList() {
    const { songStore } = useStores();

    return useObserver(() => (
        <List divided relaxed>
            {songStore.songs.map((song: Song) => {
                return(
                    
                        <SongItem song={song} />
                    
                )
            })}
        </List>
    ))
}

export const SongModal = () => {
    const { mainStore } = useStores();

    return useObserver(() => (
        <Modal
            open={mainStore.songModalVisible}
            closeOnDimmerClick={true}
            onClose={() => mainStore.showSongModal(false)}
            closeIcon
        >
            <Modal.Header>Les chansons que j’aime</Modal.Header>
            <Modal.Content scrolling>
                <Modal.Description>
                    <SongList></SongList>
                </Modal.Description>
            </Modal.Content>
        </Modal>
    ))
}