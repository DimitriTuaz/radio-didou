import React from 'react'
import { useObserver } from 'mobx-react-lite'
import { useStores } from '../hooks/UseStores'
import { UserState } from '../stores/UserStore'
import { Modal, Form, Segment, Grid, Button, Divider } from 'semantic-ui-react'

interface IProps {
}

export const UserModal = (props: IProps) => {
    const { commonStore, mainStore } = useStores();

    const renderUserModal = () => {
        if (commonStore.userState === UserState.connected) {
            return ConnectedModal()
        }
        else if (commonStore.userState === UserState.signup) {
            return SignupModal()
        }
        else {
            return LoginModal();
        }
    }

    return useObserver(() => (
        <Modal
            open={mainStore.loginModalVisible}
            closeOnDimmerClick={true}
            onClose={() => mainStore.showLoginModal(false)}
            closeIcon
        >
            {renderUserModal()}
        </Modal>
    ))
}

const LoginModal = () => {
    const { commonStore, userStore } = useStores();

    return useObserver(() => (

        <Modal.Description>
            <Segment placeholder>
                <Grid columns={2} relaxed='very' stackable>
                    <Grid.Column>
                        <Form>
                            <Form.Input
                                icon='user'
                                iconPosition='left'
                                label='Email'
                                placeholder='rogis.elroud@mail.com'
                                error={userStore.userNotFound}
                                value={userStore.user.email}
                                onChange={(e) => userStore.user.email = e.currentTarget.value}
                            />
                            <Form.Input
                                icon='lock'
                                iconPosition='left'
                                label='Mot de passe'
                                type='password'
                                placeholder='••••••'
                                value={userStore.password}
                                onChange={(e) => userStore.password = e.currentTarget.value}
                            />

                            <Button content='Se connecter' primary onClick={userStore.login} />
                        </Form>
                    </Grid.Column>

                    <Grid.Column verticalAlign='middle'>
                        <Button
                            content='S’inscrire'
                            icon='signup'
                            size='big'
                            primary
                            onClick={() => commonStore.userState = UserState.signup}
                        />
                    </Grid.Column>
                </Grid>

                <Divider vertical>Ou</Divider>
            </Segment>
        </Modal.Description>
    ))
}

const SignupModal = () => {
    const { userStore } = useStores();

    return useObserver(() => (
        <Modal.Content image>
            <Modal.Description>
                <Form>
                    <Form.Group>
                        <Form.Input
                            label='Email'
                            placeholder='rogis.elroud@mail.com'
                            type='email'
                            icon='mail'
                            iconPosition='left'
                            width={8}
                            error={userStore.emailError}
                            value={userStore.user.email}
                            onChange={(e) => userStore.user.email = e.currentTarget.value}
                        />
                        <Form.Input
                            label='Mot de passe'
                            placeholder='••••••'
                            type='password'
                            icon='lock'
                            iconPosition='left'
                            width={6}
                            error={userStore.passwordError}
                            value={userStore.password}
                            onChange={(e) => userStore.password = e.currentTarget.value}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Input
                            label='Nom'
                            placeholder='Elroud'
                            width={8}
                            value={userStore.user.lastName}
                            onChange={(e) => userStore.user.lastName = e.currentTarget.value}
                        />
                        <Form.Input
                            label='Prénom'
                            placeholder='Rogis'
                            width={6}
                            value={userStore.user.firstName}
                            onChange={(e) => userStore.user.firstName = e.currentTarget.value}
                        />
                    </Form.Group>
                    <Form.Button primary onClick={userStore.createAccount}>S’inscrire</Form.Button>
                </Form>
            </Modal.Description>
        </Modal.Content>
    ))
}

const ConnectedModal = () => {
    const { userStore } = useStores();

    return useObserver(() => (
        <Modal.Content image>
            <Modal.Description>
                <p>Connecté avec l'adresse {userStore.user.email}</p>
                <Button
                    content='Se déconnecter'
                    primary
                    onClick={userStore.logout}
                />
            </Modal.Description>
        </Modal.Content>
    ))
}
