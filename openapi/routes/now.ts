/** Loopback 4 - OpenApi Route: now **/

import request from 'superagent';
import { OpenAPI } from '..'

export namespace NowController {

    export function getNow(): Promise<NowObject> {
        return new Promise<NowObject>(async (resolve, reject) => {
                        try {
                const response = await request
                    .get(OpenAPI.URL + '/now/get');
                resolve(response.body);
            } catch (error) {
                reject(error);
            }
        });
    }

    export function show(): Promise<NowCredentials[]> {
        return new Promise<NowCredentials[]>(async (resolve, reject) => {
                        try {
                const response = await request
                    .get(OpenAPI.URL + '/now/show');
                resolve(response.body);
            } catch (error) {
                reject(error);
            }
        });
    }

    export function create(): Promise<NowCredentials> {
        return new Promise<NowCredentials>(async (resolve, reject) => {
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
