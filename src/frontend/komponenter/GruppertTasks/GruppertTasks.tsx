import AlertStripe from 'nav-frontend-alertstriper';
import { NavLink, useParams, useSearchParams } from 'react-router-dom';
import { Normaltekst } from 'nav-frontend-typografi';
import { taskStatus, ITask } from '../../typer/task';
import Paginering from '../Felleskomponenter/Paginering/Paginering';
import { useTaskContext } from '../TaskProvider';
import * as moment from 'moment';
import classNames from 'classnames';
import TaskListe from '../Task/TaskListe';
import TopBar from '../Felleskomponenter/TopBar/TopBar';
import { RessursStatus } from '@navikt/familie-typer';
import React, { FC } from 'react';

interface GruppertTasker {
    [key: string]: ITask[];
}

const GruppertTasks: FC = () => {
    const { service } = useParams();
    const { tasks, statusFilter } = useTaskContext();
    const [searchParams] = useSearchParams();

    const callId = searchParams.get('callId') ? searchParams.get('callId')?.toString() : '';

    const gruppertTasks: GruppertTasker =
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
                                <Paginering />
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
                                            className={classNames(
                                                'venstremeny__link',
                                                finnesDetFeiledeTasker ? 'FEILET' : 'OK',
                                                callId === displayCallId ? 'active-task' : ''
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
        case RessursStatus.IKKE_TILGANG:
            return (
                <AlertStripe
                    children={`Ikke tilgang til tasker: ${tasks.frontendFeilmelding}`}
                    type={'advarsel'}
                />
            );
        case RessursStatus.FEILET:
            return (
                <AlertStripe
                    children={`Innhenting av tasker feilet: ${tasks.frontendFeilmelding}`}
                    type={'feil'}
                />
            );
        default:
            return <div />;
    }
};

export default GruppertTasks;
