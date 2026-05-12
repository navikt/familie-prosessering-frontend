import { Button, Link } from '@navikt/ds-react';
import classNames from 'classnames';
import * as moment from 'moment';
import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { ITask, TaskStatus, taskStatusTekster, taskTypeTekster } from '../../typer/task';
import { useServiceContext } from '../ServiceContext';
import { useTaskContext } from '../TaskProvider';
import AvvikshåndteringModal from './AvvikshåndteringModal/AvvikshåndteringModal';
import KommenteringModal from './KommenteringModal/kommenteringModal';
import KopierKnapp from '../Felleskomponenter/KopierKnapp/KopierKnapp';
import TaskLogg from './TaskLogg';
import { erProd } from '../../utils/miljø';

interface IProps {
    task: ITask;
    visLoggSomStandard?: boolean;
    visSeTaskKnapp?: boolean;
}

const getSistKjørt = (task: ITask) =>
    task.sistKjørt ? moment(task.sistKjørt).format('DD.MM.YYYY HH:mm') : 'Venter på første kjøring';

const tjenesteUrlConfig = {
    'familie-ba-sak': {
        behandling: {
            prod: 'https://familie-ba-sak.intern.nav.no/internal/redirect/behandling/',
            dev: 'https://familie-ba-sak.intern.dev.nav.no/internal/redirect/behandling/',
        },
        fagsak: {
            prod: 'https://barnetrygd.intern.nav.no/fagsak/',
            dev: 'https://barnetrygd.ansatt.dev.nav.no/fagsak/',
        },
    },
    'familie-ks-sak': {
        behandling: {
            prod: 'https://familie-ks-sak.intern.nav.no/api/forvaltning/redirect/behandling/',
            dev: 'https://familie-ks-sak.intern.dev.nav.no/api/forvaltning/redirect/behandling/',
        },
        fagsak: {
            prod: 'https://kontantstotte.intern.nav.no/fagsak/',
            dev: 'https://kontantstotte.ansatt.dev.nav.no/fagsak/',
        },
    },
};

const hentLenkeTilBehandling = (
    tjeneste: keyof typeof tjenesteUrlConfig,
    behandlingsId: string
): string => `${tjenesteUrlConfig[tjeneste].behandling[erProd() ? 'prod' : 'dev']}${behandlingsId}`;

const hentLenkeTilFagsak = (tjeneste: keyof typeof tjenesteUrlConfig, fagsakId: string): string =>
    `${tjenesteUrlConfig[tjeneste].fagsak[erProd() ? 'prod' : 'dev']}${fagsakId}`;

const verdiSkalKopieres = (key: string): boolean =>
    ['callId', 'fnr', 'søkersFødselsnummer', 'søkersFnr', 'journalpostId'].some((k) =>
        key.toLowerCase().includes(k.toLowerCase())
    );

const eksternLenkeIkon = (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path
            d="M5 2H2v8h8V7M7 2h3v3M5 7l5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const TaskPanel: FC<IProps> = ({ task, visLoggSomStandard = false, visSeTaskKnapp = true }) => {
    const { rekjørTasks } = useTaskContext();
    const { valgtService } = useServiceContext();

    const [visAvvikshåndteringModal, settVisAvvikshåndteringModal] = useState(false);
    const [visKommenteringModal, settVisKommenteringModal] = useState(false);
    const [visLogg, settVisLogg] = useState(visLoggSomStandard);

    const openSearchErrorLenke = `https://logs.az.nav.no/app/data-explorer/discover#?_g=(time:(from:'${task.opprettetTidspunkt}',to:now))&_q=(filters:!((query:(match_phrase:(team:teamfamilie))),(query:(match_phrase:(x_callId:'${task.metadata.callId}'))),(query:(match_phrase:(level:Error)))),query:(language:kuery,query:''))`;
    const openSearchInfoLenke = `https://logs.az.nav.no/app/data-explorer/discover#?_g=(time:(from:'${task.opprettetTidspunkt}',to:now))&_q=(filters:!((query:(match_phrase:(team:teamfamilie))),(query:(match_phrase:(x_callId:'${task.metadata.callId}')))),query:(language:kuery,query:''))`;

    const grafanaCluster = erProd() ? 'PD969E40991D5C4A8' : 'P7BE696147D279490';
    const grafanaLenke = `https://grafana.nav.cloud.nais.io/d/221170ed-1c38-41bc-a581-d90a322caf2d/team-familie-task-logs?from=${new Date(task.opprettetTidspunkt).getTime()}Z&to=now&timezone=Europe%2FOslo&var-cluster=${grafanaCluster}&var-app=$__all&var-level=$__all&var-Filters=service_name%7C%21%3D%7Cnais-ingress&var-Filters=k8s_container_name%7C%21%3D%7Ccloudsql-proxy&var-Filters=k8s_container_name%7C%21%3D%7Csecure-logs-fluentbit&var-Filters=service_name%7C%21%3D%7Ckube-events&var-Filters=callId%7C%3D%7C${task.callId}`;

    const teamLogsCluster = erProd() ? 'prod-160d' : 'dev-ae07';
    const teamLogsLenke = `https://console.cloud.google.com/logs/query;query=jsonPayload.callId%3D%22${task.callId}%22;startTime=${new Date(task.opprettetTidspunkt).toISOString()};?project=teamfamilie-${teamLogsCluster}`;

    const sistKjørt = getSistKjørt(task);
    const navigate = useNavigate();

    const tjeneste = valgtService?.id;
    const tjenesteStøtterLenke = tjeneste === 'familie-ba-sak' || tjeneste === 'familie-ks-sak';

    const taskNavn = taskTypeTekster[task.taskStepType]
        ? taskTypeTekster[task.taskStepType]
        : task.taskStepType;
    const erFeilet = task.status === TaskStatus.FEILET;
    const erFerdig = task.status === TaskStatus.FERDIG;
    const railModifier = erFeilet
        ? 'taskkort__rail--feil'
        : erFerdig
          ? 'taskkort__rail--ok'
          : 'taskkort__rail--noytral';

    return (
        <article className={'taskkort'}>
            <AvvikshåndteringModal
                settÅpen={settVisAvvikshåndteringModal}
                task={task}
                åpen={visAvvikshåndteringModal}
            />
            <KommenteringModal
                settÅpen={settVisKommenteringModal}
                task={task}
                åpen={visKommenteringModal}
            />

            <div className={'taskkort__topp'}>
                <div className={classNames('taskkort__rail', railModifier)}>
                    <svg
                        className={'taskkort__rail-ikon'}
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                    >
                        {erFeilet ? (
                            <path
                                d="M6 6l12 12M18 6L6 18"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            />
                        ) : (
                            <path
                                d="M5 12l5 5 9-10"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        )}
                    </svg>
                    <span className={'taskkort__rail-label'}>{taskStatusTekster[task.status]}</span>
                </div>

                <div className={'taskkort__hoved'}>
                    <div className={'taskkort__tittel'}>
                        <span className={'taskkort__id'}>#{task.id}</span>
                        <span className={'taskkort__navn'}>{taskNavn}</span>
                    </div>
                    <dl className={'kv-grid'}>
                        {Object.entries(task.metadata).map(([key, value]) => {
                            let lenke: string | null = null;
                            if (tjenesteStøtterLenke) {
                                if (key === 'behandlingsId' || key === 'behandlingId') {
                                    lenke = hentLenkeTilBehandling(tjeneste, value);
                                } else if (key === 'fagsakId') {
                                    lenke = hentLenkeTilFagsak(tjeneste, value);
                                }
                            }

                            return (
                                <React.Fragment key={key}>
                                    <dt>{key}</dt>
                                    <dd>
                                        {lenke ? (
                                            <a
                                                href={lenke}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {value}
                                            </a>
                                        ) : (
                                            <span>{value}</span>
                                        )}
                                        {verdiSkalKopieres(key) && (
                                            <KopierKnapp verdi={value} etikett={key} />
                                        )}
                                    </dd>
                                </React.Fragment>
                            );
                        })}
                        {task.kommentar && (
                            <>
                                <dt>kommentar</dt>
                                <dd>
                                    <span>{task.kommentar}</span>
                                </dd>
                            </>
                        )}
                    </dl>
                </div>

                <div className={'taskkort__tider'}>
                    <dl className={'kv-grid'}>
                        <dt>Sist kjørt</dt>
                        <dd>
                            <span>{sistKjørt}</span>
                        </dd>
                        <dt>Triggertid</dt>
                        <dd>
                            <span>{moment(task.triggerTid).format('DD.MM.YYYY HH:mm')}</span>
                        </dd>
                        <dt>Opprettet</dt>
                        <dd>
                            <span>
                                {moment(task.opprettetTidspunkt).format('DD.MM.YYYY HH:mm')}
                            </span>
                        </dd>
                    </dl>
                </div>

                <div className={'taskkort__lenker'}>
                    <Link href={openSearchErrorLenke}>
                        {eksternLenkeIkon}
                        Error logs
                    </Link>
                    <Link href={openSearchInfoLenke}>
                        {eksternLenkeIkon}
                        Info logs
                    </Link>
                    <Link href={grafanaLenke} target={'_blank'}>
                        {eksternLenkeIkon}
                        Grafana
                    </Link>
                    <Link href={teamLogsLenke} target={'_blank'}>
                        {eksternLenkeIkon}
                        Team Logs
                    </Link>
                    <Link
                        href={''}
                        onClick={(event) => {
                            settVisAvvikshåndteringModal(!visAvvikshåndteringModal);
                            event.preventDefault();
                        }}
                    >
                        {eksternLenkeIkon}
                        Avvikshåndter
                    </Link>
                    <Link
                        href={''}
                        onClick={(event) => {
                            settVisKommenteringModal(!visKommenteringModal);
                            event.preventDefault();
                        }}
                    >
                        {eksternLenkeIkon}
                        Kommenter
                    </Link>
                </div>

                <div className={'taskkort__handlinger'}>
                    {visSeTaskKnapp && (
                        <Button
                            size={'small'}
                            variant={'primary'}
                            onClick={() => navigate(`/service/${valgtService?.id}/task/${task.id}`)}
                        >
                            Se task
                        </Button>
                    )}
                    <Button
                        size={'small'}
                        variant={'secondary'}
                        onClick={(event) => {
                            settVisLogg(!visLogg);
                            event.preventDefault();
                        }}
                    >
                        {`${visLogg ? 'Skjul' : 'Vis'} logg${task.antallLogger ? ` (${task.antallLogger})` : ''}`}
                    </Button>
                    <Button
                        size={'small'}
                        variant={'secondary'}
                        icon={<ArrowCirclepathIcon aria-hidden="true" />}
                        onClick={() => rekjørTasks(task.id)}
                    >
                        Rekjør
                    </Button>
                </div>
            </div>

            {visLogg && (
                <div className={'taskkort__logg'}>
                    <TaskLogg taskId={task.id} visLogg={visLogg} />
                </div>
            )}
        </article>
    );
};

export default TaskPanel;
