import { taskStatus } from './task';

export interface IService {
    displayName: string;
    id: string;
    proxyPath: string;
}

export interface IServiceStatistikkResponse {
    hentet?: number;
    statistikk: {
        [key: string]: IStatusAntall;
    };
}

export type IStatusAntall = {
    [key in taskStatus]: number;
};
