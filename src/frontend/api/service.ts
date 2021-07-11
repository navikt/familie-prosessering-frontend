import { IService } from '../typer/service';
import { axiosRequest } from './axios';
import { Ressurs } from '@navikt/familie-typer';

export const hentServices = (): Promise<Ressurs<IService[]>> => {
    return axiosRequest({
        method: 'GET',
        url: `/services`,
    });
};
