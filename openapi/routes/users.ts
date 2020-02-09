import request from 'superagent';

export namespace UserController {

    function login(): request.SuperAgentRequest {
        return request.post('/users/login');
    }

    function logout(): request.SuperAgentRequest {
        return request.post('/users/logout');
    }

    function currentUser(): request.SuperAgentRequest {
        return request.get('/users/me');
    }

    function register(): request.SuperAgentRequest {
        return request.post('/users/register');
    }

    function findById(): request.SuperAgentRequest {
        return request.get('/users/:userId');
    }
}
