/** Loopback 4 - OpenApi Route: users **/

import request from 'superagent';
import { OpenAPI } from '..';
import * as schema from '../schemas';

export namespace UserController {

    export function login(): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            try {
                const response = await request
                    .post(OpenAPI.URL + '/users/login');
                resolve(response.body);
            } catch (error) {
                reject(error);
            }
        });
    }

    export function logout(): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            try {
                const response = await request
                    .post(OpenAPI.URL + '/users/logout');
                resolve(response.body);
            } catch (error) {
                reject(error);
            }
        });
    }

    export function currentUser(): Promise<object> {
        return new Promise<object>(async (resolve, reject) => {
            try {
                const response = await request
                    .get(OpenAPI.URL + '/users/me');
                resolve(response.body);
            } catch (error) {
                reject(error);
            }
        });
    }

    export function register(): Promise<schema.User> {
        return new Promise<schema.User>(async (resolve, reject) => {
            try {
                const response = await request
                    .post(OpenAPI.URL + '/users/register');
                resolve(response.body);
            } catch (error) {
                reject(error);
            }
        });
    }

    export function findById(): Promise<schema.User> {
        return new Promise<schema.User>(async (resolve, reject) => {
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
