import request from 'superagent';

export namespace NowController {

    function deleteById(): request.SuperAgentRequest {
        return request.get('/now/delete/:credentialId');
    }

    function getNow(): request.SuperAgentRequest {
        return request.get('/now/get');
    }

    function setNow(): request.SuperAgentRequest {
        return request.get('/now/set/:credentialId');
    }

    function show(): request.SuperAgentRequest {
        return request.get('/now/show');
    }

    function create(): request.SuperAgentRequest {
        return request.get('/now/:serviceId/callback');
    }
}
