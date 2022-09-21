import { Alert, BodyShort } from '@navikt/ds-react';
import { RessursStatus } from '@navikt/familie-typer';
import classNames from 'classnames';
import * as moment from 'moment';
import React, { FC } from 'react';
import { NavLink, useParams, useSearchParams } from 'react-router-dom';
import { ITask, taskStatus } from '../../typer/task';
import Paginering from '../Felleskomponenter/Paginering/Paginering';
import TopBar from '../Felleskomponenter/TopBar/TopBar';
import TaskListe from '../Task/TaskListe';
import { useTaskContext } from '../TaskProvider';

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
                                            <BodyShort size={'small'}>{`#${
                                                sistKjørtTask.id
                                            }, ${moment(sistKjørtTask.opprettetTidspunkt).format(
                                                'DD.MM.YYYY HH:mm'
                                            )}`}</BodyShort>
                                            <BodyShort
                                                size={'small'}
                                            >{`Call id: ${displayCallId}`}</BodyShort>
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
            return <Alert variant={'info'}>Laster tasker</Alert>;
        case RessursStatus.IKKE_TILGANG:
            return (
                <Alert variant={'warning'}>
                    Ikke tilgang til tasker: {tasks.frontendFeilmelding}
                </Alert>
            );
        case RessursStatus.FEILET:
            return (
                <Alert variant={'error'}>
                    Innhenting av tasker feilet: {tasks.frontendFeilmelding}
                </Alert>
            );
        default:
            return <div />;
    }
};

export default GruppertTasks;
