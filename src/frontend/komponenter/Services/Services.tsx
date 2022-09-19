import { Alert, Button, Heading } from '@navikt/ds-react';
import { RessursStatus } from '@navikt/familie-typer';
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
            return <Alert variant={'info'}>Laster tasker</Alert>;
        case RessursStatus.FEILET:
            return (
                <Alert variant={'error'}>
                    Innhenting av services feilet: {services.frontendFeilmelding}
                </Alert>
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
            <Heading size={'medium'}>{service.displayName}</Heading>
            {taskerTilOppfølging && (
                <TaskerTilOppfølging taskerTilOppfølging={taskerTilOppfølging} />
            )}
            <div className={'services__service--actions'}>
                <Button
                    onClick={() => {
                        navigate(`/service/${service.id}`);
                    }}
                    variant={'secondary'}
                >
                    Alle tasker
                </Button>
                <Button
                    onClick={() => {
                        navigate(`/service/${service.id}/gruppert`);
                    }}
                    variant={'secondary'}
                >
                    Gruppert
                </Button>
            </div>
        </div>
    );
};
export default Services;
