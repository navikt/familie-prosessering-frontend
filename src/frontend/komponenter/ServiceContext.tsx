import { byggTomRessurs, Ressurs, RessursStatus } from '@navikt/familie-typer';
import constate from 'constate';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { hentServices, hentTaskerTilOppfølging } from '../api/service';
import { IOppfølgingstask, IService } from '../typer/service';

const getServiceId = (pathname: string) => {
    return pathname.split('/')[2];
};

const [ServiceProvider, useServiceContext] = constate(() => {
    const { pathname } = useLocation();
    const [services, settServices] = useState<Ressurs<IService[]>>(byggTomRessurs());
    const [valgtService, settValgtService] = useState<IService>();
    const [taskerTilOppfølging, settTaskerTilOppfølging] = useState<IOppfølgingstask[]>([]);

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
            hentTaskerTilOppfølging(services.data).then((response) => {
                settTaskerTilOppfølging(response);
            });
        }
    }, [services]);
    useEffect(() => {
        oppdaterValgtService(services, pathname);
    }, [pathname]);

    return {
        services,
        taskerTilOppfølging,
        valgtService,
        settValgtService,
    };
});

export { ServiceProvider, useServiceContext };
