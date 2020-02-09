/** Loopback 4 - OpenApi Route: users **/

import request from 'superagent';

export namespace UserController {

    export function login(): request.SuperAgentRequest {
        return request
            .post('/users/login');
    }

    export function logout(): request.SuperAgentRequest {
        return request
            .post('/users/logout');
    }

    export function currentUser(): request.SuperAgentRequest {
        return request
            .get('/users/me');
    }

    export function register(): request.SuperAgentRequest {
        return request
            .post('/users/register');
    }

    export function findById(): request.SuperAgentRequest {
        return request
            .get('/users/:userId');
    }
}
