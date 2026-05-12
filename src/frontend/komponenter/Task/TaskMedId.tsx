import { Alert } from '@navikt/ds-react';
import { RessursStatus } from '@navikt/familie-typer';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useServiceContext } from '../ServiceContext';
import { useTaskContext } from '../TaskProvider';
import TaskPanel from './TaskPanel';

const TaskMedId: React.FC = () => {
    const { settTaskId, task } = useTaskContext();
    const { valgtService } = useServiceContext();
    const { taskId, service } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        settTaskId(taskId ? parseInt(taskId, 10) : undefined);
        return () => {
            settTaskId(undefined);
        };
    }, [settTaskId, taskId]);

    switch (task.status) {
        case RessursStatus.SUKSESS:
            return (
                <div className={'side'}>
                    <button
                        className={'tilbake-lenke'}
                        onClick={() => navigate(`/service/${service}`)}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M10 4l-4 4 4 4"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Tilbake til task-liste
                    </button>

                    <header className={'side-header'}>
                        <div>
                            <div className={'detalj-tittel'}>
                                <h1
                                    className={
                                        'navds-heading navds-heading--large side-header__tittel'
                                    }
                                >
                                    {valgtService ? valgtService.displayName : ''}
                                </h1>
                                <span className={'detalj-tittel__id'}>TaskId: {task.data.id}</span>
                            </div>
                            <p className={'side-header__ingress'}>
                                Detaljer, lenker og full feillogg.
                            </p>
                        </div>
                    </header>

                    <TaskPanel task={task.data} visLoggSomStandard={true} visSeTaskKnapp={false} />
                </div>
            );
        case RessursStatus.HENTER:
            return <Alert variant={'info'}>Laster tasker</Alert>;
        case RessursStatus.IKKE_TILGANG:
            return (
                <Alert variant={'warning'}>
                    Ikke tilgang til tasker: {task.frontendFeilmelding}
                </Alert>
            );
        case RessursStatus.FEILET:
            return (
                <Alert variant={'error'}>
                    Innhenting av tasker feilet: {task.frontendFeilmelding}
                </Alert>
            );
        default:
            return <div />;
    }
};
export default TaskMedId;
