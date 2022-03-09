import { Ressurs, RessursStatus } from '@navikt/familie-typer';
import { IOppfølgingstask, IService } from '../typer/service';
import { axiosRequest } from './axios';

export const hentServices = (): Promise<Ressurs<IService[]>> => {
    return axiosRequest({
        method: 'GET',
        url: `/services`,
    });
};

const ukjentVerdiForOppfølgingstasks = (service: IService) => ({
    serviceId: service.id,
    harMottattSvar: false,
    antallTilOppfølging: 0,
});
export const hentTaskerTilOppfølgingForService = (service: IService): Promise<IOppfølgingstask> => {
    return axiosRequest<number>({
        method: 'GET',
        url: `${service.proxyPath}/task/antall-til-oppfolging`,
    })
        .then((response: Ressurs<number>) => {
            return response.status === RessursStatus.SUKSESS
                ? {
                      serviceId: service.id,
                      harMottattSvar: true,
                      antallTilOppfølging: response.data,
                  }
                : ukjentVerdiForOppfølgingstasks(service);
        })
        .catch(() => {
            return ukjentVerdiForOppfølgingstasks(service);
        });
};
