import { Ressurs, RessursStatus } from '@navikt/familie-typer';
import { AntallTaskerMedStatusFeiletOgManuellOppfølging, IService } from '../typer/service';
import { axiosRequest } from './axios';

export const hentServices = (): Promise<Ressurs<IService[]>> => {
    return axiosRequest({
        method: 'GET',
        url: `/services`,
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
        .then(async (response: Ressurs<AntallTaskerMedStatusFeiletOgManuellOppfølging>) => {
            if (response.status === RessursStatus.SUKSESS) {
                return {
                    serviceId: service.id,
                    harMottattSvar: true,
                    antallFeilet: response.data.antallFeilet,
                    antallManuellOppfølging: response.data.antallManuellOppfølging,
                };
            } else {
                const gammelRespons = await axiosRequest<number>({
                    method: 'GET',
                    url: `${service.proxyPath}/task/antall-til-oppfolging`,
                });

                if (gammelRespons.status === RessursStatus.SUKSESS) {
                    return {
                        serviceId: service.id,
                        harMottattSvar: true,
                        antallFeilet: gammelRespons.data,
                        antallManuellOppfølging: 0,
                    };
                }
            }

            return ukjentVerdiForTaskerSomHarFeiletEllerErTilManuellOppfølging(service);
        })
        .catch(() => {
            return ukjentVerdiForTaskerSomHarFeiletEllerErTilManuellOppfølging(service);
        });
};
