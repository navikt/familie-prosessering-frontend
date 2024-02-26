import { byggTomRessurs, Ressurs, RessursStatus } from '@navikt/familie-typer';
import constate from 'constate';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { hentServices, hentTaskerSomHarFeiletEllerErTilManuellOppfølging } from '../api/service';
import { AntallTaskerMedStatusFeiletOgManuellOppfølging, IService } from '../typer/service';

const getServiceId = (pathname: string) => {
    return pathname.split('/')[2];
};

const [ServiceProvider, useServiceContext] = constate(() => {
    const { pathname } = useLocation();
    const [services, settServices] = useState<Ressurs<IService[]>>(byggTomRessurs());
    const [valgtService, settValgtService] = useState<IService>();
    const [taskerFeiletOgTilManuellOppfølging, settTaskerFeiletOgTilManuellOppfølging] = useState<
        Record<string, AntallTaskerMedStatusFeiletOgManuellOppfølging>
    >({});

    const oppdaterValgtService = (response: Ressurs<IService[]>, path: string) => {
        if (response.status === RessursStatus.SUKSESS) {
            const serviceId = getServiceId(path);
            settValgtService(response.data.find((service) => service.id === serviceId));
        }
    };

    useEffect(() => {
        hentServices().then((response: Ressurs<IService[]>) => {
            settServices(response);
            oppdaterValgtService(response, pathname);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (services.status === RessursStatus.SUKSESS) {
            services.data.map((service) => {
                hentTaskerSomHarFeiletEllerErTilManuellOppfølging(service).then((response) => {
                    settTaskerFeiletOgTilManuellOppfølging((prevState) => {
                        return { ...prevState, [service.id]: response };
                    });
                });
            });
        }
    }, [services]);

    useEffect(() => {
        oppdaterValgtService(services, pathname);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    return {
        services,
        taskerFeiletOgTilManuellOppfølging,
        valgtService,
        settValgtService,
    };
});

export { ServiceProvider, useServiceContext };
