/** Loopback 4 - OpenApi Route: users **/

import request from 'superagent';
import { OpenAPI } from '..'

export namespace UserController {

    export function login(): request.SuperAgentRequest {
        return request
            .post(OpenAPI.URL + '/users/login');
    }

    export function logout(): request.SuperAgentRequest {
        return request
            .post(OpenAPI.URL + '/users/logout');
    }

    export function currentUser(): request.SuperAgentRequest {
        return request
            .get(OpenAPI.URL + '/users/me');
    }

    export function register(): request.SuperAgentRequest {
        return request
            .post(OpenAPI.URL + '/users/register');
    }

    export function findById(): request.SuperAgentRequest {
        return request
            .get(OpenAPI.URL + '/users/:userId');
    }
}
