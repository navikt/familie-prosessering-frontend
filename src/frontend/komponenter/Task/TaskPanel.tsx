import { BodyShort, Button, Heading, Label, Link, Panel } from '@navikt/ds-react';
import classNames from 'classnames';
import * as moment from 'moment';
import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ITask, taskStatusTekster, taskTypeTekster } from '../../typer/task';
import { useServiceContext } from '../ServiceContext';
import { useTaskContext } from '../TaskProvider';
import AvvikshåndteringModal from './AvvikshåndteringModal/AvvikshåndteringModal';
import KommenteringModal from './KommenteringModal/kommenteringModal';
import TaskElement from './TaskElement';
import TaskLogg from './TaskLogg';
import { erProd } from '../../utils/miljø';

interface IProps {
    task: ITask;
}

// Kan bruke sistKjørt når man gått over helt til v2 av tasks
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

const TaskPanel: FC<IProps> = ({ task }) => {
    const { rekjørTasks } = useTaskContext();
    const { valgtService } = useServiceContext();

    const [visAvvikshåndteringModal, settVisAvvikshåndteringModal] = useState(false);
    const [visKommenteringModal, settVisKommenteringModal] = useState(false);
    const [visLogg, settVisLogg] = useState(false);

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

    return (
        <Panel className={'taskpanel'} border={true}>
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
            <div className={classNames('taskpanel__status', task.status)}>
                <Label as="p">{taskStatusTekster[task.status]}</Label>
            </div>
            <Button
                size={'small'}
                variant={'secondary'}
                onClick={() => rekjørTasks(task.id)}
                className={'taskpanel__rekjør'}
            >
                Rekjør
            </Button>

            <div className={'taskpanel__innhold'}>
                <Heading size={'medium'}>
                    #{task.id}:{' '}
                    {taskTypeTekster[task.taskStepType]
                        ? taskTypeTekster[task.taskStepType]
                        : task.taskStepType}
                </Heading>
                <div className={'taskpanel__innhold--elementer'}>
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
                            <TaskElement
                                key={key}
                                label={key}
                                innhold={
                                    lenke ? (
                                        <a href={lenke} target="_blank" rel="noopener noreferrer">
                                            {value}
                                        </a>
                                    ) : (
                                        value
                                    )
                                }
                            />
                        );
                    })}

                    <TaskElement label={'Sist kjørt'} innhold={sistKjørt} />
                    <TaskElement
                        label={'Triggertid'}
                        innhold={moment(task.triggerTid).format('DD.MM.YYYY HH:mm')}
                    />
                    {task.kommentar && <TaskElement label={'Kommentar'} innhold={task.kommentar} />}
                </div>
            </div>

            <div className={'taskpanel__lenker'}>
                <Link href={openSearchErrorLenke}>Error logs</Link>
                <Link href={openSearchInfoLenke}>Info logs</Link>
                <Link href={grafanaLenke} target={'_blank'}>
                    Grafana
                </Link>
                <Link href={teamLogsLenke} target={'_blank'}>
                    Team Logs
                </Link>
                <Link
                    href={''}
                    onClick={(event) => {
                        settVisAvvikshåndteringModal(!visAvvikshåndteringModal);
                        event.preventDefault();
                    }}
                >
                    Avvikshåndter
                </Link>
                <Link
                    href={''}
                    onClick={(event) => {
                        settVisKommenteringModal(!visKommenteringModal);
                        event.preventDefault();
                    }}
                >
                    Kommenter
                </Link>
            </div>

            <div className={'taskpanel__metadata'}>
                <BodyShort size={'small'}>
                    {moment(task.opprettetTidspunkt).format('DD.MM.YYYY HH:mm')}
                </BodyShort>
            </div>
            <div className={'taskpanel__vislogg taskpanel__gruppert'}>
                <Button
                    className={'taskpanel__tilTask'}
                    variant={'secondary'}
                    onClick={() => navigate(`/service/${valgtService?.id}/task/${task.id}`)}
                >
                    Se task
                </Button>
                <Button
                    variant={'secondary'}
                    onClick={(event) => {
                        settVisLogg(!visLogg);
                        event.preventDefault();
                    }}
                >
                    {`${visLogg ? 'Skjul' : 'Vis'} logg (${task.antallLogger})`}
                </Button>
            </div>

            <div className={classNames('taskpanel__logg', visLogg ? '' : 'skjul')}>
                <TaskLogg taskId={task.id} visLogg={visLogg} />
            </div>
        </Panel>
    );
};

export default TaskPanel;
