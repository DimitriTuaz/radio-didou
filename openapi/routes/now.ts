/** Loopback 4 - OpenApi Route: now **/

import request from 'superagent';
import { OpenAPI } from '..'

export namespace NowController {

    export function deleteById(): request.SuperAgentRequest {
        return request
            .get(OpenAPI.URL + '/now/delete/:credentialId');
    }

    export function getNow(): request.SuperAgentRequest {
        return request
            .get(OpenAPI.URL + '/now/get');
    }

    export function setNow(): request.SuperAgentRequest {
        return request
            .get(OpenAPI.URL + '/now/set/:credentialId');
    }

    export function show(): request.SuperAgentRequest {
        return request
            .get(OpenAPI.URL + '/now/show');
    }

    export function create(): request.SuperAgentRequest {
        return request
            .get(OpenAPI.URL + '/now/:serviceId/callback');
    }
}
