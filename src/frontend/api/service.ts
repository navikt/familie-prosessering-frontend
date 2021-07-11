import { Ressurs } from '../typer/ressurs';
import { IService, IServiceStatistikkResponse } from '../typer/service';
import { axiosRequest } from './axios';

export const hentServices = (): Promise<Ressurs<IService[]>> => {
    return axiosRequest({
        method: 'GET',
        url: `/services`,
    });
};

export const hentServiceStatistikk = (): Promise<Ressurs<IServiceStatistikkResponse>> => {
    return axiosRequest({
        method: 'GET',
        url: `/statistikk`,
    });
};
