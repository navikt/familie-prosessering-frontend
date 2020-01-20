import * as classNames from 'classnames';
import * as moment from 'moment';
import { Knapp } from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import PanelBase from 'nav-frontend-paneler';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import * as React from 'react';
import {
    ITaskDTO,
    ITaskLogg,
    loggType,
    taskStatusTekster,
    taskTypeTekster,
} from '../../typer/task';
import { actions, useTaskDispatch } from '../TaskProvider';
import AvvikshåndteringModal from './AvvikshåndteringModal/AvvikshåndteringModal';
import TaskElement from './TaskElement';

interface IProps {
    taskDTO: ITaskDTO;
}

const TaskPanel: React.StatelessComponent<IProps> = ({ taskDTO }) => {
    const [visLogg, settVisLogg] = React.useState(false);
    const [visAvvikshåndteringModal, settVisAvvikshåndteringModal] = React.useState(false);

    const tasksDispatcher = useTaskDispatch();

    const task = taskDTO.task;
    const kibanaErrorLenke = `https://logs.adeo.no/app/kibana#/discover/48543ce0-877e-11e9-b511-6967c3e45603?_g=(refreshInterval:(pause:!t,value:0),time:(from:'${task.opprettetTidspunkt}',mode:relative,to:now))&_a=(columns:!(message,envclass,environment,level,application,host),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'logstash-apps-*',key:team,negate:!f,params:(query:teamfamilie,type:phrase),type:phrase,value:teamfamilie),query:(match:(team:(query:teamfamilie,type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'96e648c0-980a-11e9-830a-e17bbd64b4db',key:level,negate:!f,params:(query:Error,type:phrase),type:phrase,value:Error),query:(match:(level:(query:Error,type:phrase))))),index:'96e648c0-980a-11e9-830a-e17bbd64b4db',interval:auto,query:(language:lucene,query:${task.metadata.callId}),sort:!('@timestamp',desc))`;
    const kibanaInfoLenke = `https://logs.adeo.no/app/kibana#/discover/48543ce0-877e-11e9-b511-6967c3e45603?_g=(refreshInterval:(pause:!t,value:0),time:(from:'${task.opprettetTidspunkt}',mode:relative,to:now))&_a=(columns:!(message,envclass,environment,level,application,host),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'logstash-apps-*',key:team,negate:!f,params:(query:teamfamilie,type:phrase),type:phrase,value:teamfamilie),query:(match:(team:(query:teamfamilie,type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'96e648c0-980a-11e9-830a-e17bbd64b4db',key:level,negate:!f,params:(query:Info,type:phrase),type:phrase,value:Info),query:(match:(level:(query:Info,type:phrase))))),index:'96e648c0-980a-11e9-830a-e17bbd64b4db',interval:auto,query:(language:lucene,query:${task.metadata.callId}),sort:!('@timestamp',desc))`;
    const sortertTaskLogg = task.logg.sort((a, b) =>
        moment(b.opprettetTidspunkt).diff(moment(a.opprettetTidspunkt))
    );

    return (
        <PanelBase className={'taskpanel'} border={true}>
            <AvvikshåndteringModal
                settÅpen={settVisAvvikshåndteringModal}
                task={task}
                åpen={visAvvikshåndteringModal}
            />
            <div className={classNames('taskpanel__status', task.status)}>
                <Element children={taskStatusTekster[task.status]} />
            </div>
            <Knapp
                mini={true}
                onClick={() => tasksDispatcher({ payload: task.id, type: actions.REKJØR_TASK })}
                className={'taskpanel__rekjør'}
            >
                Rekjør
            </Knapp>

            <div className={'taskpanel__innhold'}>
                <Undertittel
                    children={`#${task.id}: ${
                        taskTypeTekster[task.taskStepType]
                            ? taskTypeTekster[task.taskStepType]
                            : `${task.taskStepType}`
                    }`}
                />
                <div className={'taskpanel__innhold--elementer'}>
                    {Object.keys(task.metadata).map((key: string) => {
                        return <TaskElement key={key} label={key} innhold={task.metadata[key]} />;
                    })}
                    <TaskElement
                        label={'Sist kjørt'}
                        innhold={moment(sortertTaskLogg[0].opprettetTidspunkt).format(
                            'DD.MM.YYYY HH:mm'
                        )}
                    />
                </div>
            </div>

            <div className={'taskpanel__lenker'}>
                <Lenke href={kibanaErrorLenke} children={'Kibana error'} />
                <Lenke href={kibanaInfoLenke} children={'Kibana info'} />
                <Lenke
                    href={''}
                    onClick={event => {
                        settVisAvvikshåndteringModal(!visAvvikshåndteringModal);
                        event.preventDefault();
                    }}
                    children={'Avvikshåndter'}
                />
            </div>

            <div className={'taskpanel__metadata'}>
                <Normaltekst
                    children={moment(task.opprettetTidspunkt).format('DD.MM.YYYY HH:mm')}
                />
            </div>

            <Knapp
                className={'taskpanel__vislogg'}
                mini={true}
                onClick={() => settVisLogg(!visLogg)}
            >
                {`${visLogg ? 'Skjul' : 'Vis'} logg`}
            </Knapp>

            <div className={classNames('taskpanel__logg', visLogg ? '' : 'skjul')}>
                {sortertTaskLogg.map((logg: ITaskLogg, index: number) => {
                    let melding;
                    try {
                        melding = logg.melding
                            ? JSON.parse(logg.melding).stacktrace
                                ? JSON.parse(logg.melding).stacktrace
                                : logg.melding
                            : 'Ingen melding';
                    } catch (error) {
                        melding = logg.melding ? logg.melding : undefined;
                    }

                    return (
                        <div key={index} className={'taskpanel__logg--item'}>
                            <div className={'taskpanel__logg--item-metadata'}>
                                <Element children={logg.type} />
                                <Normaltekst children={`Endret av: ${logg.endretAv}`} />
                                <Normaltekst
                                    children={moment(logg.opprettetTidspunkt).format(
                                        'DD.MM.YYYY HH:mm'
                                    )}
                                />
                                <Normaltekst children={logg.node} />
                            </div>

                            {melding && (
                                <pre
                                    className={'taskpanel__logg--item-melding'}
                                    children={melding}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </PanelBase>
    );
};

const hentSisteBehandlerLoggmelding = (logg: ITaskLogg[]) => {
    return logg.filter((l: ITaskLogg) => l.type === loggType.BEHANDLER).slice(-1)[0];
};

export default TaskPanel;
