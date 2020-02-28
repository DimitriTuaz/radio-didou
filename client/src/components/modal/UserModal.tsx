import React from 'react'
import { useObserver } from 'mobx-react-lite'
import { Modal, Form, Segment, Grid, Button, Divider } from 'semantic-ui-react'

import { UserState } from '../../stores'
import { useStore } from '../../hooks'

export const UserModal = () => {
    const { userStore } = useStore();

    return (
        <React.Fragment>
            {(() => {
                switch (userStore.userState) {
                    case UserState.connected:
                        return ConnectedModal();
                    case UserState.signup:
                        return SignupModal();
                    default:
                        return LoginModal();
                }
            })()}
        </React.Fragment>
    );
}

const LoginModal = () => {
    const { userStore } = useStore();

    return useObserver(() => (

        <Modal.Description>
            <Segment placeholder>
                <Grid columns={2} relaxed='very'>
                    <Grid.Column>
                        <Form loading={userStore.loginLoading}>
                            <Form.Input
                                icon='user'
                                iconPosition='left'
                                label='Email'
                                placeholder='rogis.elrood@mail.com'
                                error={userStore.userNotFound}
                                value={userStore.user.email}
                                onChange={(e) => {
                                    userStore.user.email = e.currentTarget.value;
                                    userStore.userNotFound = false
                                }}
                            />
                            <Form.Input
                                icon='lock'
                                iconPosition='left'
                                label='Mot de passe'
                                type='password'
                                placeholder='••••••'
                                error={userStore.userNotFound}
                                value={userStore.password}
                                onChange={(e) => {
                                    userStore.password = e.currentTarget.value;
                                    userStore.userNotFound = false
                                }} />
                            <div className={'user-modal-login-error-container'}>
                                <p className={'error-msg'}>
                                    {userStore.userNotFound ?
                                        'L’email ou le mot de passe est incorrect' : ''}
                                </p>
                            </div>
                            <Button content='Se connecter' primary onClick={userStore.login} />
                        </Form>
                    </Grid.Column>

                    <Grid.Column verticalAlign='middle'>
                        <Button
                            content='S’inscrire'
                            icon='signup'
                            size='big'
                            primary
                            onClick={() => userStore.userState = UserState.signup}
                        />
                    </Grid.Column>
                </Grid>

                <Divider vertical>Ou</Divider>
            </Segment>
        </Modal.Description>
    ))
}

const SignupModal = () => {
    const { userStore } = useStore();

    return useObserver(() => (
        <Modal.Content image>
            <Modal.Description>
                <Form loading={userStore.signupLoading}>
                    <Form.Group widths='equal'>
                        <Form.Input
                            label='Email'
                            placeholder='rogis.elrood@mail.com'
                            type='email'
                            icon='mail'
                            iconPosition='left'
                            fluid
                            error={userStore.emailError}
                            value={userStore.user.email}
                            onChange={(e) => {
                                userStore.user.email = e.currentTarget.value;
                                userStore.emailError = null
                            }}
                        />

                        <Form.Input
                            label='Mot de passe'
                            placeholder='••••••'
                            type='password'
                            icon='lock'
                            iconPosition='left'
                            fluid
                            error={userStore.passwordError ?
                                'Le mot de passe doit contenir au moins 6 caractères' : null}
                            value={userStore.password}
                            onChange={(e) => {
                                userStore.password = e.currentTarget.value;
                                userStore.passwordError = false
                            }}
                        />
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Form.Input
                            label='Nom'
                            placeholder='Elrood'
                            fluid
                            error={userStore.lastNameError ? 'Le nom ne peut pas être vide' : null}
                            value={userStore.user.lastName}
                            onChange={(e) => {
                                userStore.user.lastName = e.currentTarget.value;
                                userStore.lastNameError = false
                            }}
                        />
                        <Form.Input
                            label='Prénom'
                            placeholder='Rogis'
                            fluid
                            error={userStore.firstNameError ? 'Le prénom ne peut pas être vide' : null}
                            value={userStore.user.firstName}
                            onChange={(e) => {
                                userStore.user.firstName = e.currentTarget.value;
                                userStore.firstNameError = false
                            }}
                        />
                    </Form.Group>
                    <Segment basic textAlign={"center"}>
                        <Form.Button primary onClick={userStore.createAccount}>S’inscrire</Form.Button>
                    </Segment>
                </Form>
            </Modal.Description>
        </Modal.Content>
    ))
}

const ConnectedModal = () => {
    const { userStore } = useStore();

    return useObserver(() => (
        <Modal.Content image>
            <Modal.Description>
                <Segment basic textAlign={"center"}>
                    <p>Connecté avec l'adresse {userStore.user.email} ({userStore.user.firstName} {userStore.user.lastName})</p>
                    <Button
                        content='Se déconnecter'
                        primary
                        onClick={userStore.logout}
                    />
                </Segment>
            </Modal.Description>
        </Modal.Content>
    ))
}
