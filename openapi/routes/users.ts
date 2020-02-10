/** Loopback 4 - OpenApi Route: users **/

import request from 'superagent';
import { OpenAPI } from '..'

export namespace UserController {

    export function currentUser(): Promise<> {
        return new Promise<>(async (resolve, reject) => {
                        try {
                const response = await request
                    .get(OpenAPI.URL + '/users/me');
                resolve(response.body);
            } catch (error) {
                reject(error);
            }
        });
    }

    export function register(): Promise<User> {
        return new Promise<User>(async (resolve, reject) => {
                        try {
                const response = await request
                    .post(OpenAPI.URL + '/users/register');
                resolve(response.body);
            } catch (error) {
                reject(error);
            }
        });
    }

    export function findById(): Promise<User> {
        return new Promise<User>(async (resolve, reject) => {
                        try {
                const response = await request
                    .get(OpenAPI.URL + '/users/:userId');
                resolve(response.body);
            } catch (error) {
                reject(error);
            }
        });
    }
}
