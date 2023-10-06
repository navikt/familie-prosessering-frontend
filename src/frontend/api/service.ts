import { Ressurs, RessursStatus } from '@navikt/familie-typer';
import {
    AntallTaskerMedStatusFeiletOgManuellOppfølging,
    IOppfølgingstask,
    IService,
} from '../typer/service';
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

const ukjentVerdiForTaskerSomHarFeiletEllerErTilManuellOppfølging = (service: IService) => ({
    serviceId: service.id,
    harMottattSvar: false,
    antallFeilet: 0,
    antallManuellOppfølging: 0,
});

export const hentTaskerSomHarFeiletEllerErTilManuellOppfølging = async (
    service: IService
): Promise<AntallTaskerMedStatusFeiletOgManuellOppfølging> => {
    return axiosRequest<AntallTaskerMedStatusFeiletOgManuellOppfølging>({
        method: 'GET',
        url: `${service.proxyPath}/task/antall-feilet-og-manuell-oppfolging`,
    })
        .then((response: Ressurs<AntallTaskerMedStatusFeiletOgManuellOppfølging>) => {
            return response.status === RessursStatus.SUKSESS
                ? {
                      serviceId: service.id,
                      harMottattSvar: true,
                      antallFeilet: response.data.antallFeilet,
                      antallManuellOppfølging: response.data.antallManuellOppfølging,
                  }
                : ukjentVerdiForTaskerSomHarFeiletEllerErTilManuellOppfølging(service);
        })
        .catch(() => {
            return ukjentVerdiForTaskerSomHarFeiletEllerErTilManuellOppfølging(service);
        });
};
