import AlertStripe from 'nav-frontend-alertstriper';
import { Systemtittel } from 'nav-frontend-typografi';
import * as React from 'react';
import { useHistory } from 'react-router';
import { IService } from '../../typer/service';
import { actions, Dispatch, useServiceContext, useServiceDispatch } from '../ServiceProvider';
import ServiceIkon from './ServiceIkon';
import { Knapp } from 'nav-frontend-knapper';
import { RessursStatus } from '@navikt/familie-typer';

const Services: React.FunctionComponent = () => {
    const services = useServiceContext().services;
    const dispatch = useServiceDispatch();
    const history = useHistory();

    switch (services.status) {
        case RessursStatus.SUKSESS:
            return (
                <div className={'services'}>
                    {services.data.map((service: IService) => Service(service, dispatch, history))}
                </div>
            );
        case RessursStatus.HENTER:
            return <AlertStripe children={`Laster tasker`} type={'info'} />;
        case RessursStatus.FEILET:
            return (
                <AlertStripe
                    children={`Innhenting av services feilet: ${services.frontendFeilmelding}`}
                    type={'feil'}
                />
            );
        default:
            return <div />;
    }
};

const Service = (service: IService, dispatch: Dispatch, history: any) => {
    return (
        <div key={service.id} className={'services__service'}>
            <ServiceIkon heigth={150} width={150} />
            <Systemtittel children={service.displayName} />

            <div className={'services__service--actions'}>
                <Knapp
                    onClick={() => {
                        dispatch({
                            payload: service,
                            type: actions.SETT_VALGT_SERVICE,
                        });
                        history.push(`/service/${service.id}`);
                    }}
                    mini={true}
                >
                    Alle tasker
                </Knapp>
                <Knapp
                    onClick={() => {
                        dispatch({
                            payload: service,
                            type: actions.SETT_VALGT_SERVICE,
                        });
                        history.push(`/service/${service.id}/gruppert`);
                    }}
                    mini={true}
                >
                    Gruppert
                </Knapp>
            </div>
        </div>
    );
};

export default Services;
