import { RessursStatus } from '@navikt/familie-typer';
import AlertStripe from 'nav-frontend-alertstriper';
import { Knapp } from 'nav-frontend-knapper';
import { Systemtittel } from 'nav-frontend-typografi';
import React from 'react';
import { NavigateFunction } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { IOppfølgingstask, IService } from '../../typer/service';
import { useServiceContext } from '../ServiceContext';
import ServiceIkon from './ServiceIkon';
import TaskerTilOppfølging from './TaskerTilOppfølging';

const Services: React.FunctionComponent = () => {
    const { services, taskerTilOppfølging } = useServiceContext();
    const navigate = useNavigate();

    switch (services.status) {
        case RessursStatus.SUKSESS:
            return (
                <div className={'services'}>
                    {services.data.map((service: IService) => (
                        <Service
                            key={service.id}
                            service={service}
                            navigate={navigate}
                            taskerTilOppfølging={taskerTilOppfølging[service.id]}
                        />
                    ))}
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

const Service: React.FC<{
    service: IService;
    navigate: NavigateFunction;
    taskerTilOppfølging?: IOppfølgingstask;
}> = ({ service, navigate, taskerTilOppfølging }) => {
    return (
        <div key={service.id} className={'services__service'}>
            <ServiceIkon heigth={150} width={150} />
            <Systemtittel children={service.displayName} />
            {taskerTilOppfølging && (
                <TaskerTilOppfølging taskerTilOppfølging={taskerTilOppfølging} />
            )}
            <div className={'services__service--actions'}>
                <Knapp
                    onClick={() => {
                        navigate(`/service/${service.id}`);
                    }}
                    mini={true}
                >
                    Alle tasker
                </Knapp>
                <Knapp
                    onClick={() => {
                        navigate(`/service/${service.id}/gruppert`);
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
