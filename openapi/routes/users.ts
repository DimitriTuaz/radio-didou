import { superagent, SuperAgentRequest} from 'superagent';

export namespace UserController {

    function login(): SuperAgentRequest {
        return superagent.post('/users/login');
    }

    function logout(): SuperAgentRequest {
        return superagent.post('/users/logout');
    }

    function currentUser(): SuperAgentRequest {
        return superagent.get('/users/me');
    }

    function register(): SuperAgentRequest {
        return superagent.post('/users/register');
    }

    function findById(): SuperAgentRequest {
        return superagent.get('/users/:userId');
    }
}
