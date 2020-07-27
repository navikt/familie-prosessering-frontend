import AlertStripe from 'nav-frontend-alertstriper';
import { NavLink, useHistory, useParams } from 'react-router-dom';
import { parse } from 'query-string';
import { Normaltekst } from 'nav-frontend-typografi';
import * as React from 'react';
import { RessursStatus } from '../../typer/ressurs';
import { taskStatus, ITask } from '../../typer/task';
import { useTaskContext } from '../TaskProvider';
import * as moment from 'moment';
import * as classNames from 'classnames';
import TaskListe from '../Task/TaskListe';
import TopBar from '../Felleskomponenter/TopBar/TopBar';

const GruppertTasks: React.FunctionComponent = () => {
    const { service } = useParams();
    const tasks = useTaskContext().tasks;
    const history = useHistory();
    const search = parse(history.location.search);
    const callId = search.callId ? search.callId.toString() : '';
    const statusFilter = useTaskContext().statusFilter;

    const gruppertTasks =
        tasks.status === RessursStatus.SUKSESS
            ? tasks.data.tasks.reduce((gruppert: { [key: string]: ITask[] }, task: ITask) => {
                  const gruppeTasks = gruppert[task.metadata.callId]
                      ? gruppert[task.metadata.callId]
                      : [];

                  return {
                      ...gruppert,
                      [task.metadata.callId]: [...gruppeTasks, task].sort((a, b) =>
                          moment(b.opprettetTidspunkt).diff(moment(a.opprettetTidspunkt))
                      ),
                  };
              }, {})
            : {};

    switch (tasks.status) {
        case RessursStatus.SUKSESS:
            return (
                <div className={'gruppert-tasks'}>
                    <TopBar />

                    <br />
                    <div className={'gruppert-tasks__container'}>
                        <div className={'gruppert-tasks__container--venstremeny'}>
                            <div className={'venstremeny'}>
                                {Object.values(gruppertTasks).map((tasker: ITask[]) => {
                                    const sistKjørtTask = tasker[0];
                                    const displayCallId = sistKjørtTask.metadata.callId;

                                    const finnesDetFeiledeTasker = tasker.find(
                                        (task) => task.status === taskStatus.FEILET
                                    );
                                    const to = `/service/${service}/gruppert?statusFilter=${statusFilter}&callId=${displayCallId}`;

                                    return (
                                        <NavLink
                                            key={displayCallId}
                                            id={displayCallId}
                                            to={to}
                                            tabIndex={0}
                                            activeClassName={''}
                                            className={classNames(
                                                'venstremeny__link',
                                                history.location.search.includes(displayCallId)
                                                    ? 'active'
                                                    : '',
                                                finnesDetFeiledeTasker ? 'FEILET' : 'OK'
                                            )}
                                        >
                                            <Normaltekst>{`#${sistKjørtTask.id}, ${moment(
                                                sistKjørtTask.opprettetTidspunkt
                                            ).format('DD.MM.YYYY HH:mm')}`}</Normaltekst>
                                            <Normaltekst>{`Call id: ${displayCallId}`}</Normaltekst>
                                        </NavLink>
                                    );
                                })}
                            </div>
                        </div>

                        <main className={'gruppert-tasks__container--main'}>
                            {callId && gruppertTasks[callId] && (
                                <TaskListe tasks={gruppertTasks[callId]} />
                            )}
                        </main>
                    </div>
                </div>
            );
        case RessursStatus.HENTER:
            return <AlertStripe children={`Laster tasker`} type={'info'} />;
        case RessursStatus.FEILET:
            return (
                <AlertStripe
                    children={`Innhenting av tasker feilet. Feilmelding: ${tasks.melding}`}
                    type={'feil'}
                />
            );
        default:
            return <div />;
    }
};

export default GruppertTasks;
