import AlertStripe from 'nav-frontend-alertstriper';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import * as React from 'react';
import { useHistory } from 'react-router';
import { IService, IServiceStatistikkResponse, IStatusAntall } from '../../typer/service';
import { actions, Dispatch, useServiceContext, useServiceDispatch } from '../ServiceProvider';
import ServiceIkon from './ServiceIkon';
import { Knapp } from 'nav-frontend-knapper';
import { RessursStatus } from '@navikt/familie-typer';
import 'nav-frontend-tabell-style';

const Services: React.FunctionComponent = () => {
    const services = useServiceContext().services;
    const dispatch = useServiceDispatch();
    const history = useHistory();

    switch (services.status) {
        case RessursStatus.SUKSESS:
            return (
                <>
                    <div className={'services'}>
                        {services.data.map((service: IService) =>
                            Service(service, dispatch, history)
                        )}
                    </div>
                    {serviceTabell(services.data, dispatch, history)}
                </>
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

const serviceTabell = (services: IService[], dispatch: Dispatch, history: any) => {
    const serviceStatistikk = useServiceContext().serviceStatistikk;
    const { statistikk, hentet }: IServiceStatistikkResponse =
        serviceStatistikk.status === RessursStatus.SUKSESS
            ? serviceStatistikk.data
            : { statistikk: {} };
    return (
        <>
            {hentet && (
                <Normaltekst>Statistikk hentet: {new Date(hentet).toLocaleString()}</Normaltekst>
            )}
            <table className="tabell tabell--stripet">
                <thead>
                    <tr>
                        <th>Navn</th>
                        <th>Tasks</th>
                        <th>Feilet</th>
                        <th>Manuell oppfølgning</th>
                    </tr>
                </thead>
                <tbody>
                    {services.map((service: IService) => (
                        <tr key={service.id}>
                            <td>{service.displayName}</td>
                            <td>
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
                            </td>
                            <td>{statistikk[service.id]?.FEILET}</td>
                            <td>{statistikk[service.id]?.MANUELL_OPPFØLGING}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

const Service = (service: IService, dispatch: Dispatch, history: any) => {
    return (
        <div key={service.id} className={'services__service'}>
            <ServiceIkon heigth={100} width={100} />
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
