/** Loopback 4 - OpenApi Route: now **/

import request from 'superagent';
import { OpenAPI } from '..';
import * as schema from '../schemas';

export namespace NowController {

    export function deleteById(): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            try {
                const response = await request
                    .get(OpenAPI.URL + '/now/delete/:credentialId');
                resolve(response.body);
            } catch (error) {
                reject(error);
            }
        });
    }

    export function getNow(): Promise<schema.NowObject> {
        return new Promise<schema.NowObject>(async (resolve, reject) => {
            try {
                const response = await request
                    .get(OpenAPI.URL + '/now/get');
                resolve(response.body);
            } catch (error) {
                reject(error);
            }
        });
    }

    export function setNow(): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            try {
                const response = await request
                    .get(OpenAPI.URL + '/now/set/:credentialId');
                resolve(response.body);
            } catch (error) {
                reject(error);
            }
        });
    }

    export function show(): Promise<schema.NowCredentials[]> {
        return new Promise<schema.NowCredentials[]>(async (resolve, reject) => {
            try {
                const response = await request
                    .get(OpenAPI.URL + '/now/show');
                resolve(response.body);
            } catch (error) {
                reject(error);
            }
        });
    }

    export function create(): Promise<schema.NowCredentials> {
        return new Promise<schema.NowCredentials>(async (resolve, reject) => {
            try {
                const response = await request
                    .get(OpenAPI.URL + '/now/:serviceId/callback');
                resolve(response.body);
            } catch (error) {
                reject(error);
            }
        });
    }
}
