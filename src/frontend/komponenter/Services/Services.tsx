import { Alert, Button, Heading, Loader } from '@navikt/ds-react';
import { RessursStatus } from '@navikt/familie-typer';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AntallTaskerMedStatusFeiletOgManuellOppfølging,
    IService,
    IServiceGruppe,
} from '../../typer/service';
import { TaskStatus } from '../../typer/task';
import { useServiceContext } from '../ServiceContext';
import TaskerTilOppfølging from './TaskerTilOppfølging';

const utledStatusFilter = (
    taskerFeiletOgManuellOppfølging: AntallTaskerMedStatusFeiletOgManuellOppfølging | undefined
): TaskStatus => {
    if (!taskerFeiletOgManuellOppfølging?.harMottattSvar) {
        return TaskStatus.FEILET;
    }
    if (taskerFeiletOgManuellOppfølging.antallFeilet > 0) {
        return TaskStatus.FEILET;
    }
    if (taskerFeiletOgManuellOppfølging.antallManuellOppfølging > 0) {
        return TaskStatus.MANUELL_OPPFØLGING;
    }
    return TaskStatus.FERDIG;
};

const Services: React.FunctionComponent = () => {
    const { services, taskerFeiletOgTilManuellOppfølging } = useServiceContext();

    switch (services.status) {
        case RessursStatus.SUKSESS:
            return (
                <div className={'service-wrapper'}>
                    {Object.keys(IServiceGruppe).map((serviceGruppe) => {
                        return (
                            <ServiceGruppe
                                key={serviceGruppe}
                                gruppe={serviceGruppe}
                                servicer={services.data.filter(
                                    (service) => service.gruppe === serviceGruppe
                                )}
                                taskerFeiletOgTilManuellOppfølging={
                                    taskerFeiletOgTilManuellOppfølging
                                }
                            />
                        );
                    })}
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

const gruppeTilTekst: Record<string, string> = {
    EF: 'Alene med barn',
    FELLES: 'Fellestjenester',
    BAKS: 'Barnetrygd og kontantstøtte',
    ETTERLATTE: 'Etterlatte',
};

const ServiceGruppe: React.FC<{
    servicer: IService[];
    gruppe: string;
    taskerFeiletOgTilManuellOppfølging: Record<
        string,
        AntallTaskerMedStatusFeiletOgManuellOppfølging
    >;
}> = ({ servicer, gruppe, taskerFeiletOgTilManuellOppfølging }) => {
    if (servicer.length === 0) {
        return undefined;
    }
    return (
        <div className={'service-gruppe'}>
            <Heading size={'large'} className={'service-gruppe-header'}>
                {gruppeTilTekst[gruppe]}
            </Heading>
            <div className={'services'}>
                {servicer.map((service: IService) => (
                    <Service
                        key={service.id}
                        service={service}
                        servicer={servicer}
                        taskerFeiletOgManuellOppfølging={
                            taskerFeiletOgTilManuellOppfølging[service.id]
                        }
                    />
                ))}
            </div>
        </div>
    );
};

const Service: React.FC<{
    service: IService;
    servicer: IService[];
    taskerFeiletOgManuellOppfølging: AntallTaskerMedStatusFeiletOgManuellOppfølging;
}> = ({ service, servicer, taskerFeiletOgManuellOppfølging }) => {
    const navigate = useNavigate();
    return (
        <div key={service.id} className={'services__service'}>
            <Heading size={'medium'}>{service.displayName}</Heading>
            {taskerFeiletOgManuellOppfølging ? (
                <TaskerTilOppfølging
                    service={service}
                    servicer={servicer}
                    taskerFeiletOgManuellOppfølging={taskerFeiletOgManuellOppfølging}
                />
            ) : (
                <Loader size={'large'} />
            )}

            <div className={'services__service--actions'}>
                <Button
                    onClick={() => {
                        const statusFilter = utledStatusFilter(taskerFeiletOgManuellOppfølging);
                        navigate(`/service/${service.id}?statusFilter=${statusFilter}`);
                    }}
                    size={'medium'}
                    variant={'secondary'}
                >
                    Alle tasker
                </Button>

                <Button
                    onClick={() => {
                        const statusFilter = utledStatusFilter(taskerFeiletOgManuellOppfølging);
                        navigate(`/service/${service.id}/gruppert?statusFilter=${statusFilter}`);
                    }}
                    size={'medium'}
                    variant={'secondary'}
                >
                    Gruppert
                </Button>
            </div>
        </div>
    );
};
export default Services;
