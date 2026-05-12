import { Alert, Loader } from '@navikt/ds-react';
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
import Statuspill, { Statusvariant } from '../Felleskomponenter/Statuspill/Statuspill';

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

const gruppeTittel: Record<string, string> = {
    EF: 'Alene med barn',
    FELLES: 'Fellestjenester',
    BAKS: 'Barnetrygd og kontantstøtte',
    ETTERLATTE: 'Etterlatte',
};

const formaterOppdatert = (): string => {
    const nå = new Date();
    const pad = (verdi: number) => verdi.toString().padStart(2, '0');
    return `${pad(nå.getDate())}.${pad(nå.getMonth() + 1)}.${nå.getFullYear()} ${pad(nå.getHours())}:${pad(nå.getMinutes())}`;
};

const Services: React.FunctionComponent = () => {
    const { services, taskerFeiletOgTilManuellOppfølging } = useServiceContext();

    switch (services.status) {
        case RessursStatus.SUKSESS:
            return (
                <div className={'side'}>
                    <header className={'side-header'}>
                        <div>
                            <h1
                                className={'navds-heading navds-heading--large side-header__tittel'}
                            >
                                Oversikt
                            </h1>
                            <p className={'side-header__ingress'}>
                                Tasks gruppert etter fagområde og tjeneste.
                            </p>
                        </div>
                        <div className={'side-header__meta'}>Oppdatert {formaterOppdatert()}</div>
                    </header>

                    <div className={'dashboard'}>
                        {Object.keys(IServiceGruppe).map((gruppe) => (
                            <ServiceGruppe
                                key={gruppe}
                                gruppe={gruppe}
                                servicer={services.data.filter((s) => s.gruppe === gruppe)}
                                taskerFeiletOgTilManuellOppfølging={
                                    taskerFeiletOgTilManuellOppfølging
                                }
                            />
                        ))}
                    </div>
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

const ServiceGruppe: React.FC<{
    servicer: IService[];
    gruppe: string;
    taskerFeiletOgTilManuellOppfølging: Record<
        string,
        AntallTaskerMedStatusFeiletOgManuellOppfølging
    >;
}> = ({ servicer, gruppe, taskerFeiletOgTilManuellOppfølging }) => {
    if (servicer.length === 0) {
        return null;
    }

    const tasksMedStatus = servicer
        .map((service) => taskerFeiletOgTilManuellOppfølging[service.id])
        .filter((status): status is AntallTaskerMedStatusFeiletOgManuellOppfølging => !!status);
    const antallFeilet = tasksMedStatus.reduce((sum, status) => sum + status.antallFeilet, 0);
    const antallManuell = tasksMedStatus.reduce(
        (sum, status) => sum + status.antallManuellOppfølging,
        0
    );
    const antallKreverOppfolging = antallFeilet + antallManuell;
    const harSvarFraAlle =
        tasksMedStatus.length === servicer.length && tasksMedStatus.every((s) => s.harMottattSvar);

    return (
        <section className={'domenekort'} aria-labelledby={`gruppe-${gruppe}`}>
            <header className={'domenekort__header'}>
                <div className={'domenekort__eyebrow'}>{gruppe}</div>
                <h2 id={`gruppe-${gruppe}`} className={'domenekort__tittel'}>
                    {gruppeTittel[gruppe]}
                </h2>
                <div className={'domenekort__meta'}>
                    {antallKreverOppfolging > 0 ? (
                        <span>
                            <span className={'domenekort__prikk domenekort__prikk--feil'} />
                            {antallKreverOppfolging} krever oppfølging
                        </span>
                    ) : harSvarFraAlle ? (
                        <span>
                            <span className={'domenekort__prikk domenekort__prikk--ok'} />
                            Alt ok
                        </span>
                    ) : null}
                </div>
            </header>

            <div className={'domenekort__body'}>
                {servicer.map((service) => (
                    <ServiceRad
                        key={service.id}
                        service={service}
                        taskerFeiletOgManuellOppfølging={
                            taskerFeiletOgTilManuellOppfølging[service.id]
                        }
                    />
                ))}
            </div>
        </section>
    );
};

const utledStatusvariant = (
    status: AntallTaskerMedStatusFeiletOgManuellOppfølging | undefined
): { variant: Statusvariant; tekst: string; subtekst: string } => {
    if (!status?.harMottattSvar) {
        return {
            variant: 'manuell',
            tekst: 'Ikke svar',
            subtekst: 'Klarte ikke å hente status',
        };
    }
    if (status.antallFeilet > 0) {
        return {
            variant: 'feil',
            tekst: 'Feilet',
            subtekst: `${status.antallFeilet} task${status.antallFeilet === 1 ? '' : 's'} krever oppmerksomhet`,
        };
    }
    if (status.antallManuellOppfølging > 0) {
        return {
            variant: 'manuell',
            tekst: 'Manuell',
            subtekst: `${status.antallManuellOppfølging} til manuell oppfølging`,
        };
    }
    return {
        variant: 'ok',
        tekst: 'Ingen feil',
        subtekst: 'Ingen åpne tasks',
    };
};

const ServiceRad: React.FC<{
    service: IService;
    taskerFeiletOgManuellOppfølging: AntallTaskerMedStatusFeiletOgManuellOppfølging | undefined;
}> = ({ service, taskerFeiletOgManuellOppfølging }) => {
    const navigate = useNavigate();
    const statusKlar = !!taskerFeiletOgManuellOppfølging;
    const { variant, tekst, subtekst } = utledStatusvariant(taskerFeiletOgManuellOppfølging);

    const åpne = (visning: 'alle' | 'gruppert') => {
        const statusFilter = utledStatusFilter(taskerFeiletOgManuellOppfølging);
        const suffix = visning === 'gruppert' ? '/gruppert' : '';
        navigate(`/service/${service.id}${suffix}?statusFilter=${statusFilter}`);
    };

    return (
        <div className={'service-rad'}>
            {statusKlar ? (
                <Statuspill variant={variant} tekst={tekst} />
            ) : (
                <Loader size={'small'} title={'Henter status'} />
            )}
            <div className={'service-rad__info'}>
                <div className={'service-rad__navn'}>{service.displayName}</div>
                <div className={'service-rad__sub'}>{subtekst}</div>
            </div>
            <div
                className={'segmentert'}
                role={'group'}
                aria-label={`Visningsvalg for ${service.displayName}`}
            >
                <button className={'segmentert__knapp is-aktiv'} onClick={() => åpne('alle')}>
                    Alle tasker
                </button>
                <button className={'segmentert__knapp'} onClick={() => åpne('gruppert')}>
                    Gruppert
                </button>
            </div>
        </div>
    );
};

export default Services;
