import { Request, Response } from 'express';
import { IService, serviceConfig } from './serviceConfig';
import request, { Response as RequestResponse } from 'request';

const buildError = (service: IService, response: RequestResponse, error: any) => {
    return {
        id: service.id,
        statusCode: response.statusCode,
        error,
    };
};

interface Statistikk {
    id: string;
    statistikk: {
        [key: string]: number;
    };
}

interface Cache {
    status: 'IKKE_HENTET' | 'HENTER' | 'HENTET';
    age: number;
    data: unknown;
}

const statistikkCache: Cache = {
    status: 'IKKE_HENTET',
    age: Date.now(),
    data: {},
};

const hent = (req: Request, res: Response) => {
    const requests = serviceConfig
        .filter((service: IService) => service.statistikk)
        .map((service: IService) => {
            const url = `${service.proxyUrl}/api/task/statistikk`;
            return new Promise((resolve, reject) => {
                request.get(url, (error, response: RequestResponse, body) => {
                    if (error) {
                        reject(buildError(service, response, error));
                    } else {
                        try {
                            resolve({
                                id: service.id,
                                statistikk: JSON.parse(body),
                            });
                        } catch (e) {
                            reject(buildError(service, response, body));
                        }
                    }
                });
            });
        });
    Promise.all(requests)
        .then((values: Statistikk[]) => {
            const response = {
                data: {
                    hentet: Date.now(),
                    historikk: values.reduce((acc, r: Statistikk) => {
                        acc[r.id] = r.statistikk;
                        return acc;
                    }, {} as any),
                },
                status: 'SUKSESS',
            };
            statistikkCache.age = Date.now();
            statistikkCache.data = response;
            statistikkCache.status = 'HENTET';
            res.status(200).send(response).end();
        })
        .catch((error) => {
            statistikkCache.status = 'IKKE_HENTET';
            res.status(200)
                .send({
                    status: 'FEILET',
                    frontendFeilmelding: error,
                })
                .end();
        });
};

export const hentStatistikk = (req: Request, res: Response) => {
    const now = Date.now();
    let age = now - statistikkCache.age;
    if (statistikkCache.status === 'IKKE_HENTET' || age > 2 * 60_000) {
        statistikkCache.status = 'HENTER';
        statistikkCache.age = Date.now();
        hent(req, res);
    } else if (statistikkCache.status === 'HENTER') {
        if (age > 5_000) {
            statistikkCache.age = Date.now();
            hent(req, res);
        } else {
            setTimeout(() => {
                hentStatistikk(req, res);
            }, 5_000 - age);
        }
    } else {
        res.status(200).send(statistikkCache.data).end();
    }
};
