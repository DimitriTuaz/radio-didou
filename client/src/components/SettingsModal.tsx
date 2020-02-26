import React from 'react'
import { useObserver } from 'mobx-react-lite'
import { Modal, Header, Button } from 'semantic-ui-react'

import { useStore } from '../hooks'

export const SettingsModal = () => {
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
                        Mon compte spotify
                    </Header>
                    <Button>Ajouter un compte</Button>
                </Modal.Description>
            </Modal.Content>
        </Modal>
    ))
}
