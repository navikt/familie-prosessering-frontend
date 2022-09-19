import { BodyShort, Button, Heading, Label, Link, Panel } from '@navikt/ds-react';
import classNames from 'classnames';
import * as moment from 'moment';
import React, { FC, useState } from 'react';
import { ITask, taskStatusTekster, taskTypeTekster } from '../../typer/task';
import { useTaskContext } from '../TaskProvider';
import AvvikshåndteringModal from './AvvikshåndteringModal/AvvikshåndteringModal';
import KommenteringModal from './KommenteringModal/kommenteringModal';
import TaskElement from './TaskElement';
import TaskLogg from './TaskLogg';

interface IProps {
    task: ITask;
}

// Kan bruke sistKjørt når man gått over helt til v2 av tasks
const getSistKjørt = (task: ITask) =>
    task.sistKjørt ? moment(task.sistKjørt).format('DD.MM.YYYY HH:mm') : 'Venter på første kjøring';

const TaskPanel: FC<IProps> = ({ task }) => {
    const { rekjørTasks } = useTaskContext();
    const [visAvvikshåndteringModal, settVisAvvikshåndteringModal] = useState(false);
    const [visKommenteringModal, settVisKommenteringModal] = useState(false);
    const [visLogg, settVisLogg] = useState(false);

    const kibanaErrorLenke = `https://logs.adeo.no/app/kibana#/discover/48543ce0-877e-11e9-b511-6967c3e45603?_g=(refreshInterval:(pause:!t,value:0),time:(from:'${task.opprettetTidspunkt}',mode:relative,to:now))&_a=(columns:!(message,envclass,environment,level,application,host),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'logstash-apps-*',key:team,negate:!f,params:(query:teamfamilie,type:phrase),type:phrase,value:teamfamilie),query:(match:(team:(query:teamfamilie,type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'96e648c0-980a-11e9-830a-e17bbd64b4db',key:level,negate:!f,params:(query:Error,type:phrase),type:phrase,value:Error),query:(match:(level:(query:Error,type:phrase))))),index:'96e648c0-980a-11e9-830a-e17bbd64b4db',interval:auto,query:(language:lucene,query:"${task.metadata.callId}"),sort:!('@timestamp',desc))`;
    const kibanaInfoLenke = `https://logs.adeo.no/app/kibana#/discover/48543ce0-877e-11e9-b511-6967c3e45603?_g=(refreshInterval:(pause:!t,value:0),time:(from:'${task.opprettetTidspunkt}',mode:relative,to:now))&_a=(columns:!(message,envclass,environment,level,application,host),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'logstash-apps-*',key:team,negate:!f,params:(query:teamfamilie,type:phrase),type:phrase,value:teamfamilie),query:(match:(team:(query:teamfamilie,type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'96e648c0-980a-11e9-830a-e17bbd64b4db',key:level,negate:!f,params:(query:Info,type:phrase),type:phrase,value:Info),query:(match:(level:(query:Info,type:phrase))))),index:'96e648c0-980a-11e9-830a-e17bbd64b4db',interval:auto,query:(language:lucene,query:"${task.metadata.callId}"),sort:!('@timestamp',desc))`;

    const sistKjørt = getSistKjørt(task);

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
                <Label children={taskStatusTekster[task.status]} />
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
                <Link href={kibanaErrorLenke} children={'Kibana error'} />
                <Link href={kibanaInfoLenke} children={'Kibana info'} />
                <Link
                    href={''}
                    onClick={(event) => {
                        settVisAvvikshåndteringModal(!visAvvikshåndteringModal);
                        event.preventDefault();
                    }}
                    children={'Avvikshåndter'}
                />
                <Link
                    href={''}
                    onClick={(event) => {
                        settVisKommenteringModal(!visKommenteringModal);
                        event.preventDefault();
                    }}
                    children={'Kommenter'}
                />
            </div>

            <div className={'taskpanel__metadata'}>
                <BodyShort
                    size={'small'}
                    children={moment(task.opprettetTidspunkt).format('DD.MM.YYYY HH:mm')}
                />
            </div>

            <Button
                className={'taskpanel__vislogg'}
                variant={'secondary'}
                onClick={(event) => {
                    settVisLogg(!visLogg);
                    event.preventDefault();
                }}
            >
                {`${visLogg ? 'Skjul' : 'Vis'} logg (${task.antallLogger})`}
            </Button>

            <div className={classNames('taskpanel__logg', visLogg ? '' : 'skjul')}>
                <TaskLogg taskId={task.id} visLogg={visLogg} />
            </div>
        </Panel>
    );
};

export default TaskPanel;
