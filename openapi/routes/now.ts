import { superagent, SuperAgentRequest} from 'superagent';

export namespace NowController {

    function deleteById(): SuperAgentRequest {
        return superagent.get('/now/delete/:credentialId');
    }

    function getNow(): SuperAgentRequest {
        return superagent.get('/now/get');
    }

    function setNow(): SuperAgentRequest {
        return superagent.get('/now/set/:credentialId');
    }

    function show(): SuperAgentRequest {
        return superagent.get('/now/show');
    }

    function create(): SuperAgentRequest {
        return superagent.get('/now/:serviceId/callback');
    }
}
