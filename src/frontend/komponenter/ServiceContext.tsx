import { useEffect, useState } from 'react';
import { hentServices } from '../api/service';
import { IService } from '../typer/service';
import { byggTomRessurs, Ressurs, RessursStatus } from '@navikt/familie-typer';
import constate from 'constate';
import { useHistory } from 'react-router';
import * as H from 'history';

function getServiceId(location: H.Location<unknown>) {
    return location.pathname.split('/')[2];
}

const [ServiceProvider, useServiceContext] = constate(() => {
    const history = useHistory();
    const [services, settServices] = useState<Ressurs<IService[]>>(byggTomRessurs());
    const [valgtService, settValgtService] = useState<IService>();

    const oppdaterValgtService = (response: Ressurs<IService[]>, location: H.Location<unknown>) => {
        if (response.status === RessursStatus.SUKSESS) {
            const serviceId = getServiceId(location);
            settValgtService(response.data.find((service) => service.id === serviceId));
        }
    };

    useEffect(() => {
        hentServices().then((response: Ressurs<IService[]>) => {
            settServices(response);
            oppdaterValgtService(response, history.location);
        });
    }, []);

    useEffect(() => {
        history.listen((location) => {
            oppdaterValgtService(services, location);
        });
    }, [history, services]);

    return {
        services,
        valgtService,
    };
});

export { ServiceProvider, useServiceContext };
