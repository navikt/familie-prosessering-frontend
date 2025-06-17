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

const TaskPanel: FC<IProps> = ({ task }) => {
    const { rekjørTasks } = useTaskContext();
    const { valgtService } = useServiceContext();
    const [visAvvikshåndteringModal, settVisAvvikshåndteringModal] = useState(false);
    const [visKommenteringModal, settVisKommenteringModal] = useState(false);
    const [visLogg, settVisLogg] = useState(false);

    const kibanaErrorLenke = `https://logs.adeo.no/app/kibana#/discover/48543ce0-877e-11e9-b511-6967c3e45603?_g=(refreshInterval:(pause:!t,value:0),time:(from:'${task.opprettetTidspunkt}',mode:relative,to:now))&_a=(columns:!(message,envclass,environment,level,application,host),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'logstash-apps-*',key:team,negate:!f,params:(query:teamfamilie,type:phrase),type:phrase,value:teamfamilie),query:(match:(team:(query:teamfamilie,type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'96e648c0-980a-11e9-830a-e17bbd64b4db',key:level,negate:!f,params:(query:Error,type:phrase),type:phrase,value:Error),query:(match:(level:(query:Error,type:phrase))))),index:'96e648c0-980a-11e9-830a-e17bbd64b4db',interval:auto,query:(language:lucene,query:"${task.metadata.callId}"),sort:!('@timestamp',desc))`;
    const kibanaInfoLenke = `https://logs.adeo.no/app/kibana#/discover/48543ce0-877e-11e9-b511-6967c3e45603?_g=(refreshInterval:(pause:!t,value:0),time:(from:'${task.opprettetTidspunkt}',mode:relative,to:now))&_a=(columns:!(message,envclass,environment,level,application,host),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'logstash-apps-*',key:team,negate:!f,params:(query:teamfamilie,type:phrase),type:phrase,value:teamfamilie),query:(match:(team:(query:teamfamilie,type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'96e648c0-980a-11e9-830a-e17bbd64b4db',key:level,negate:!f,params:(query:Info,type:phrase),type:phrase,value:Info),query:(match:(level:(query:Info,type:phrase))))),index:'96e648c0-980a-11e9-830a-e17bbd64b4db',interval:auto,query:(language:lucene,query:"${task.metadata.callId}"),sort:!('@timestamp',desc))`;

    const grafanaCluster = erProd() ? 'PD969E40991D5C4A8' : 'P7BE696147D279490';
    const grafanaLenke = `https://grafana.nav.cloud.nais.io/d/221170ed-1c38-41bc-a581-d90a322caf2d/team-familie-task-logs?from=${new Date(task.opprettetTidspunkt).getTime()}Z&to=now&timezone=Europe%2FOslo&var-cluster=${grafanaCluster}&var-app=$__all&var-level=$__all&var-Filters=service_name%7C%21%3D%7Cnais-ingress&var-Filters=k8s_container_name%7C%21%3D%7Ccloudsql-proxy&var-Filters=k8s_container_name%7C%21%3D%7Csecure-logs-fluentbit&var-Filters=service_name%7C%21%3D%7Ckube-events&var-Filters=callId%7C%3D%7C${task.callId}`;

    const teamLogsCluster = erProd() ? 'prod-160d' : 'dev-ae07';
    const teamLogsLenke = `https://console.cloud.google.com/logs/query;query=jsonPayload.callId%3D%22${task.callId}%22;startTime=${new Date(task.opprettetTidspunkt).toISOString()};?project=teamfamilie-${teamLogsCluster}`;

    const sistKjørt = getSistKjørt(task);
    const navigate = useNavigate();

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
                    {Object.keys(task.metadata).map((key: string) => {
                        return <TaskElement key={key} label={key} innhold={task.metadata[key]} />;
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
                <Link href={kibanaErrorLenke}>Kibana error</Link>
                <Link href={kibanaInfoLenke}>Kibana info</Link>
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
