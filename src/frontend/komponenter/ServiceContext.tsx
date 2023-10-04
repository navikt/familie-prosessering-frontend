import { byggTomRessurs, Ressurs, RessursStatus } from '@navikt/familie-typer';
import constate from 'constate';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import {
    hentServices,
    hentTaskerSomHarFeilerEllerErTilManuellOppføling,
    hentTaskerTilOppfølgingForService,
} from '../api/service';
import { IAntallFeiletOgManuellOppfølging, IOppfølgingstask, IService } from '../typer/service';

const getServiceId = (pathname: string) => {
    return pathname.split('/')[2];
};

const [ServiceProvider, useServiceContext] = constate(() => {
    const { pathname } = useLocation();
    const [services, settServices] = useState<Ressurs<IService[]>>(byggTomRessurs());
    const [valgtService, settValgtService] = useState<IService>();
    const [taskerTilOppfølging, settTaskerTilOppfølging] = useState<{
        [key: string]: IOppfølgingstask;
    }>({});
    const [taskerFeiletOgManuellOppfølging, settTaskerFeiletOgManuellOppfølging] = useState<
        IAntallFeiletOgManuellOppfølging[]
    >([]);

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
    }, []);

    useEffect(() => {
        if (services.status === RessursStatus.SUKSESS) {
            services.data.map((service) => {
                hentTaskerTilOppfølgingForService(service).then((response) => {
                    settTaskerTilOppfølging((prevState) => {
                        return { ...prevState, [service.id]: response };
                    });
                });
            });
        }
    }, [services]);
    useEffect(() => {
        oppdaterValgtService(services, pathname);
    }, [pathname]);

    useEffect(() => {
        if (services.status === RessursStatus.SUKSESS) {
            services.data.map((service) => {
                hentTaskerSomHarFeilerEllerErTilManuellOppføling(service).then((response) => {
                    settTaskerFeiletOgManuellOppfølging((prevState) => [...prevState, response]);
                });
            });
        }
    }, [services]);

    return {
        services,
        taskerTilOppfølging,
        taskerFeiletOgManuellOppfølging,
        valgtService,
        settValgtService,
    };
});

export { ServiceProvider, useServiceContext };
