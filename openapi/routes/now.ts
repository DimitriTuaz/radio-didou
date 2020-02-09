/** Loopback 4 - OpenApi Route: now **/

import request from 'superagent';

export namespace NowController {

    export function deleteById(): request.SuperAgentRequest {
        return request
            .get('/now/delete/:credentialId');
    }

    export function getNow(): request.SuperAgentRequest {
        return request
            .get('/now/get');
    }

    export function setNow(): request.SuperAgentRequest {
        return request
            .get('/now/set/:credentialId');
    }

    export function show(): request.SuperAgentRequest {
        return request
            .get('/now/show');
    }

    export function create(): request.SuperAgentRequest {
        return request
            .get('/now/:serviceId/callback');
    }
}
